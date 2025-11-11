import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"
import SVGPlusCircle from "@/lib/svgs/svg_plus_circle"
import { useWriteContract,
         useWaitForTransactionReceipt,
         useAccount
       } from 'wagmi'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI, UNISWAP_V3_POSITION_MANAGER_INCREASE_LIQUIDITY_ABI } from "@/config/constants"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"
import { Decimal } from 'decimal.js'
import { decodeEventLog } from 'viem';
import { MintPositionParamsType, TokenType } from "@/common/types"
import logger from "@/common/Logger"

type AddPositionStepProps = {
    token0: TokenType;
    token1: TokenType;
    started: boolean;
    parsedCalldata: MintPositionParamsType,
    handleAddLiquiditySuccess: (positionId: bigint, token0Deposited: string, token1Deposited: string) => void;
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    token0PreBalance: string;
    token0Deposited: string;
    token1PreBalance: string;
    token1Deposited: string;
    positionId: bigint;
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    token0PreBalance: '',
    token0Deposited: '',
    token1PreBalance: '',
    token1Deposited: '',
    positionId: BigInt(-1)
}

const AddPositionStep:React.FC<AddPositionStepProps> = ({started, parsedCalldata, token0, token1,
                                                        handleAddLiquiditySuccess}) => {
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
            logger.info('[AddPositionStep] it will run handleAddPosition')
            setState({...state, isPending: true})
            handleAddPosition()
        }
    }, [started])

    useEffect(() => {
        if (hash) {
            logger.info('[AddPositionStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    const getPositionId = () => {
        if (!receipt) return BigInt(-1)
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
        logger.info('[AddPositionStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return BigInt(-1)
        if (!parsedOKLogs[0].decoded?.args) return BigInt(-1)
        return parsedOKLogs[0].decoded.args.tokenId
    }

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                logger.info('[AddPositionStep] A new position is added')
                const afterToken0Balance = await getTokenBalance(token0.address, address!, {decimals: token0.decimal})
                const afterToken1Balance = await getTokenBalance(token1.address, address!, {decimals: token1.decimal})
                const token0Deposited = new Decimal(state.token0PreBalance).minus(new Decimal(afterToken0Balance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                const token1Deposited = new Decimal(state.token1PreBalance).minus(new Decimal(afterToken1Balance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                const positionId = getPositionId()
                logger.info('[AddPositionStep] positionId=', positionId)
                setState({...state, isPending: false, isSuccess: true, positionId: positionId, token0Deposited: token0Deposited, token1Deposited: token1Deposited})
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            logger.info('[AddPositionStep] it will handleAddSuccess in 1000 milliseconds')
            timer = setTimeout(() => {
                handleAddLiquiditySuccess(state.positionId, state.token0Deposited,state.token1Deposited)
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
    
    logger.debug('[AddPositionStep] ====== Latest state ========')
    logger.debug('[AddPositionStep] isSuccess=', state.isSuccess, ' isPending=', state.isPending)
    logger.debug('[AddPositionStep]', ' hash=', hash)
    logger.debug('[AddPositionStep] writeError=', writeError)
    logger.debug('[AddPositionStep] isWriteSuccess=', isWriteSuccess, ' isWritePending=', isWritePending)
    logger.debug('[AddPositionStep] receipt=', receipt)
    logger.debug('[AddPositionStep] receiptStatus=', receiptStatus)
    logger.debug('[AddPositionStep] receiptError=', receiptError)
    
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
                                                                                ? `A new position was added` 
                                                                                :   writeError || receiptError
                                                                                    ? `Failed to add a new postion`
                                                                                    : `Adding a new postion`                                                   
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