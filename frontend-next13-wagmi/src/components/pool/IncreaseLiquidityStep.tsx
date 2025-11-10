import { useEffect, useState } from "react";
import { useWriteContract,
    useWaitForTransactionReceipt,
    useAccount
  } from 'wagmi'
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI, UNISWAP_V3_POSITION_MANAGER_INCREASE_LIQUIDITY_ABI } from "@/config/constants";
import { Decimal } from 'decimal.js'
import SVGPlusCircle from "@/lib/svgs/svg_plus_circle";
import SVGCheck from "@/lib/svgs/svg_check";
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { decodeEventLog } from 'viem';
import { IncreasePositionParamsType, TokenType } from "@/common/types";


type IncreaseLiquidityStepProps = {
    token0: TokenType;
    token1: TokenType;
    started: boolean;
    parsedCalldata: IncreasePositionParamsType;
    handleIncreaseLiquiditySuccess:(token0Deposited: string, token1Deposited: string, liquidity: string) => void
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    token0PreBalance: string;
    token0Deposited: string;
    token1PreBalance: string;
    token1Deposited: string;
    liquidity: bigint;
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    token0PreBalance: '',
    token0Deposited: '',
    token1PreBalance: '',
    token1Deposited: '',
    liquidity: BigInt(0)
}

const IncreaseLiquidityStep:React.FC<IncreaseLiquidityStepProps> = ({started, parsedCalldata, token0, token1,
                                                                    handleIncreaseLiquiditySuccess
}) => {
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

    const handleIncreaseLiquidity = () => {
        writeContract({
            address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'increaseLiquidity',
            args: [parsedCalldata],
        })
    }

    useEffect(() => {
        if (started) {
            console.log('[IncreaseLiquidityStep] it will run handleIncreaseLiquidity')
            setState({...state, isPending: true})
            handleIncreaseLiquidity()
        }
    }, [started])
    useEffect(() => {
        if (hash) {
            console.log('[IncreaseLiquidityStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    const getLiquidity = () => {
        if (!receipt) return BigInt(0)
        const parsedOKLogs = (receipt.logs || []).map((log, index) => {
            try {
                const encoded = decodeEventLog({
                    abi: UNISWAP_V3_POSITION_MANAGER_INCREASE_LIQUIDITY_ABI,
                    data: log.data,
                    topics: log.topics
                })
                return {
                    ...log,
                    decoded: encoded,
                    ok: true
                }
            } catch (error: any) {
                return {
                    ...log,
                    decoded: undefined,
                    ok: false,
                    error: error?.message
                }
            }
        }).filter((log) => log.ok)
        console.log('[IncreaseLiquidityStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return BigInt(0)
        if (!parsedOKLogs[0].decoded?.args) return BigInt(0)
        return parsedOKLogs[0].decoded.args.liquidity
    }

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                console.log('[IncreaseLiquidityStep] The new liquidity is added')
                const afterToken0Balance = await getTokenBalance(token0.address, address!, {decimals: token0.decimal})
                const afterToken1Balance = await getTokenBalance(token1.address, address!, {decimals: token1.decimal})
                const token0Deposited = new Decimal(state.token0PreBalance).minus(new Decimal(afterToken0Balance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                const token1Deposited = new Decimal(state.token1PreBalance).minus(new Decimal(afterToken1Balance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                const liquidity = getLiquidity()
                console.log('[IncreaseLiquidityStep] liquidity=', liquidity)
                setState({...state, isPending: false, isSuccess: true, token0Deposited: token0Deposited, token1Deposited: token1Deposited, liquidity: liquidity})
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            console.log('it will handleAddSuccess in 2000 milliseconds')
            timer = setTimeout(() => {
                handleIncreaseLiquiditySuccess(state.token0Deposited,state.token1Deposited, state.liquidity.toString())
            }, 2000)
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
    
    console.log('[IncreaseLiquidityStep] ====== Latest state ========')
    console.log('[IncreaseLiquidityStep] isSuccess=', state.isSuccess, ' isPending=', state.isPending)
    console.log('[IncreaseLiquidityStep]', ' hash=', hash)
    console.log('[IncreaseLiquidityStep] writeError=', writeError)
    console.log('[IncreaseLiquidityStep] isWriteSuccess=', isWriteSuccess, ' isWritePending=', isWritePending)
    console.log('[IncreaseLiquidityStep] receipt=', receipt)
    console.log('[IncreaseLiquidityStep] receiptStatus=', receiptStatus)
    console.log('[IncreaseLiquidityStep] receiptError=', receiptError)
    

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
                                                                                ? `New liquidity was added` 
                                                                                :   writeError || receiptError
                                                                                    ? `Failed to increase liquidity`
                                                                                    : `Increasing liquidity`                                                   
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

export default IncreaseLiquidityStep