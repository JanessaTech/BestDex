import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"
import SVGPlusCircle from "@/lib/svgs/svg_plus_circle"
import { useWriteContract,
         useWaitForTransactionReceipt,
         useAccount
       } from 'wagmi'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants"
import { MintPositionParamsType, TokenType } from "@/lib/types"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"
import { Decimal } from 'decimal.js'

type AddPositionStepProps = {
    token0: TokenType;
    token1: TokenType;
    started: boolean;
    parsedCalldata: MintPositionParamsType,
    handleAddSuccess: (token0ActualDeposit: string, token1ActualDeposit: string) => void;
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    token0PreBalance: string;
    token0ActualDeposit: string;
    token1PreBalance: string;
    token1ActualDeposit: string
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    token0PreBalance: '',
    token0ActualDeposit: '',
    token1PreBalance: '',
    token1ActualDeposit: ''
}

const AddPositionStep:React.FC<AddPositionStepProps> = ({started, parsedCalldata, token0, token1,
                                                            handleAddSuccess}) => {
    const [state, setState] = useState<StateType>(defaultState)
    const {address} = useAccount()
    const {getTokenBalance} = useContextUtil() as IContextUtil
    const {data: hash, writeContract, isSuccess:isWriteSuccess, isPending:isWritePending, error:writeError } = useWriteContract()
    const {data: receipt, isError, error: receiptError, status: receiptStatus, refetch: refetchReceipt} = useWaitForTransactionReceipt({
        hash: hash,
        confirmations: 1,
        query: {
            enabled: false,
            gcTime: 0,  // disable cache
            staleTime: 0  // disable cache
        }
    })

    useEffect(() => {
        (async () => {
            const token0PreBalance = await getTokenBalance(token0.address, address!, {decimals: token0.decimal})
            const token1PreBalance = await getTokenBalance(token1.address, address!, {decimals: token1.decimal})
            setState({...state, token0PreBalance: token0PreBalance, token1PreBalance: token1PreBalance})
        })()
    }, [])

    const handleAddPosition = () => {
        writeContract({
            address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'mint',
            args: [parsedCalldata],
        })
    }

    useEffect(() => {
        if (started) {
            console.log('[AddPositionStep] it will run handleAddPosition')
            setState({...state, isPending: true})
            handleAddPosition()
        }
    }, [started])

    useEffect(() => {
        if (hash) {
            console.log('[AddPositionStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                console.log('[AddPositionStep] A new position is added')
                const afterToken0Balance = await getTokenBalance(token0.address, address!, {decimals: token0.decimal})
                const afterToken1Balance = await getTokenBalance(token1.address, address!, {decimals: token1.decimal})
                const depositedToken0 = new Decimal(state.token0PreBalance).minus(new Decimal(afterToken0Balance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                const depositedToken1 = new Decimal(state.token1PreBalance).minus(new Decimal(afterToken1Balance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                setState({...state, isPending: false, isSuccess: true, token0ActualDeposit: depositedToken0, token1ActualDeposit: depositedToken1})
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            console.log('it will handleAddSuccess in 1000 milliseconds')
            timer = setTimeout(() => {
                handleAddSuccess(state.token0ActualDeposit,state.token1ActualDeposit)
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(writeError || receiptError) {
            const failedReason = 'Failed to add a new position. Check your network or your account if it has enough currencies'
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [writeError, receiptError])
    
    console.log('[AddPositionStep] ====== Latest state ========')
    console.log('[AddPositionStep] isSuccess=', state.isSuccess, ' isPending=', state.isPending)
    console.log('[AddPositionStep]', ' hash=', hash)
    console.log('[AddPositionStep] writeError=', writeError)
    console.log('[AddPositionStep] isWriteSuccess=', isWriteSuccess, ' isWritePending=', isWritePending)
    console.log('[AddPositionStep] receipt=', receipt)
    console.log('[AddPositionStep] receiptStatus=', receiptStatus)
    console.log('[AddPositionStep] receiptError=', receiptError)
    
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${state.isPending && started? '' : 'hidden'}`}/>
                <SVGPlusCircle className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${state.isSuccess
                                                ? 'text-zinc-400'  
                                                : writeError || receiptError
                                                    ? 'text-red-600'
                                                    : 'text-pink-600'}`}>{state.isSuccess
                                                                                ? `A new position is added` 
                                                                                :   writeError || receiptError
                                                                                    ? `Failed to add a new postion`
                                                                                    : `Add a new postion`                                                   
                                                                                    }</div>
            </div>
            {
                state.isPending
                ? <></>
                : state.isSuccess
                    ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                    : <ToolTipHelper content={<div className="w-80">{state.reason}</div>}>
                        <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                      </ToolTipHelper>
            }  
        </div>
    )
}

export default AddPositionStep