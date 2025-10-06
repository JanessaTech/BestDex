
import SVGCheck from "@/lib/svgs/svg_check";
import SVGCheckCircle from "@/lib/svgs/svg_check_circle";
import { TokenType } from "@/lib/types";
import { memo, useEffect, useState } from "react";
import { useSendTransaction, 
    useWaitForTransactionReceipt,
    useAccount } from 'wagmi'
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { decodeEventLog, formatUnits } from 'viem';
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, 
    UNISWAP_V3_POSITION_MANAGER_COLLECT_LIQUIDITY_ABI, 
    UNISWAP_V3_POSITION_MANAGER_DECREASE_LIQUIDITY_ABI} from "@/config/constants";


type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    token0Deposited: string;
    token1Deposited: string;
    removedLiquidity: string;
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    token0Deposited: '',
    token1Deposited: '',
    removedLiquidity: ''
}

type DecreaseLiquidityStepProps = {
    token0: TokenType;
    token1: TokenType;
    started: boolean;
    calldata: `0x${string}`;
    handleDecreaseLiquiditySuccess:(token0Deposited: string, token1Deposited: string) => void
}
const DecreaseLiquidityStep: React.FC<DecreaseLiquidityStepProps> = ({started, token0, token1, calldata,
                                                                    handleDecreaseLiquiditySuccess}) => {
    const [state, setState] = useState<StateType>(defaultState)
    const {data: txHash, isPending, isSuccess, error:sendError, sendTransaction} = useSendTransaction()
    const {data: receipt, isError: isReceiptError, error: receiptError, status: receiptStatus, refetch: refetchReceipt} = useWaitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
        query: {
            enabled: false,
            gcTime: 0,  // disable cache
            staleTime: 0  // disable cache
        }
    })

    const handleSendTransation = async () => {  
        sendTransaction({
            to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            data: calldata,
        })
    }

    useEffect(() => {
        (async () => {
            if (started) {
                console.log('[DecreaseLiquidityStep] it will send the transaction for decreasing liquidity tx')
                setState({...state, isPending: true})
                await handleSendTransation()  
            }
        })()
        
    }, [started])

    useEffect(() => {
        if (txHash) {
            console.log('[DecreaseLiquidityStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [txHash])

    const parseCollectEventLog = () => {
        const emptyRes = {amount0: '', amount1: '',}
        if (!receipt) return emptyRes
        const parsedOKLogs = (receipt.logs || []).map((log, index) => {
            try {
                const encoded = decodeEventLog({
                    abi: UNISWAP_V3_POSITION_MANAGER_COLLECT_LIQUIDITY_ABI,
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
        console.log('[DecreaseLiquidityStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return emptyRes
        if (!parsedOKLogs[0].decoded?.args) return emptyRes
        return {
            amount0: formatUnits(parsedOKLogs[0].decoded.args.amount0, token0.decimal),
            amount1: formatUnits(parsedOKLogs[0].decoded.args.amount1, token1.decimal)}
    }

    useEffect(() => {
        (async () => {
            if (!txHash || !receipt) return
            if (receipt.status === 'success') {
                console.log('[DecreaseLiquidityStep] Liquidity is decreased successful')
                const parsedLog = parseCollectEventLog()
                console.log('[DecreaseLiquidityStep] parsedLog=', parsedLog)
                setState({...state, 
                    isPending: false, isSuccess: true, 
                    token0Deposited: parsedLog.amount0, token1Deposited: parsedLog.amount1
                })
            }
        })() 
    }, [receipt, txHash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            timer = setTimeout(() => {
                handleDecreaseLiquiditySuccess(state.token0Deposited, state.token1Deposited)
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(sendError || receiptError) {
            const failedReason = 'Failed to decrease liquidity. Choose a different slippage and try again '
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [sendError, receiptError])

     // output debug info
     console.log('[DecreaseLiquidityStep] ====== Latest state ========')
     console.log('[DecreaseLiquidityStep] state=', state)
     console.log('[DecreaseLiquidityStep] txHash =', txHash)
     console.log('[DecreaseLiquidityStep] isPending =', isPending, ' isSuccess =', isSuccess, '  sendError =', sendError)
     console.log('[DecreaseLiquidityStep] isReceiptError =', isReceiptError)
     console.log('[DecreaseLiquidityStep] receiptStatus =', receiptStatus)
     console.log('[DecreaseLiquidityStep] receiptError =', receiptError)
     console.log('[DecreaseLiquidityStep] receipt =', receipt)

    return (
        <div className="flex justify-between items-center">
                <div className="flex items-center relative">
                    <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${state.isPending && started ? '' : 'hidden'}`}/>
                    <SVGCheckCircle className="text-white size-5 ml-[2px]"/>
                    <div className={`text-xs pl-3 ${ state.isSuccess
                                                            ? 'text-zinc-400'
                                                            : sendError || receiptError
                                                                ? 'text-red-600'
                                                                : 'text-pink-600'}`}>{state.isSuccess
                                                                                            ? 'The liquidity was decreased'
                                                                                            : sendError || receiptError
                                                                                                ? 'Failed to decrease liquidity'
                                                                                                : 'Decreasing liquidity'}</div>
                </div>
                <div>
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
        </div>  
    )
}

export default memo(DecreaseLiquidityStep)