import SVGCheck from "@/lib/svgs/svg_check"
import SVGCheckCircle from "@/lib/svgs/svg_check_circle"
import { useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useSendTransaction, 
         useWaitForTransactionReceipt,
         useAccount } from 'wagmi'
import {WaitForTransactionReceiptErrorType} from "@wagmi/core"
import { UNISWAP_ERRORS, V3_SWAP_ROUTER_ADDRESS } from "@/config/constants"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"
import { Decimal } from 'decimal.js'
import { TokenType } from "@/common/types"
import logger from "@/common/Logger"

const getFailedReason = (simulationError: WaitForTransactionReceiptErrorType): string => {
    const defaultReason = 'Unknown reason'
    if (simulationError?.cause) {
        const reason = (simulationError?.cause as any)?.reason
        const translatedReason = UNISWAP_ERRORS[reason] || defaultReason
        return (simulationError as any)?.shortMessage  || simulationError.message || translatedReason
    }
    return defaultReason
}

type SwapStepProps = {
    started: boolean;
    tokenTo: TokenType;
    calldata: `0x${string}`;
    handleSwapSuccess: (swapOut: string) => void
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    preBalance: string;
    actualOutput: string
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    preBalance: '',
    actualOutput: ''
}
const SwapStep:React.FC<SwapStepProps> = ({started, tokenTo, calldata, handleSwapSuccess}) => {
    const {address} = useAccount()
    const [state, setState] = useState<StateType>(defaultState)
    const {getTokenBalance} = useContextUtil() as IContextUtil

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
        const balance = await getTokenBalance(tokenTo.address, address!, {decimals: tokenTo.decimal})
        setState({...state, preBalance: balance})
        logger.debug('[SwapStep] pre balance: ',  balance, ' for ', tokenTo.address)
        sendTransaction({
            to: V3_SWAP_ROUTER_ADDRESS,
            data: calldata,
        })
    }

    useEffect(() => {
        (async () => {
            if (started) {
                logger.info('[SwapStep] it will send swap tx')
                setState({...state, isPending: true})
                await handleSendTransation()  
            }
        })()
        
    }, [started])

    useEffect(() => {
        if (txHash) {
            logger.info('[SwapStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [txHash])

    useEffect(() => {
        (async () => {
            if (!txHash || !receipt) return
            if (receipt.status === 'success') {
                logger.info('[SwapStep] swap is successful')
                const balance = await getTokenBalance(tokenTo.address, address!, {decimals: tokenTo.decimal})
                const inc = new Decimal(balance).minus(new Decimal(state.preBalance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                setState({...state, isPending: false, isSuccess: true, actualOutput: inc})
            }
        })() 
    }, [receipt, txHash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            timer = setTimeout(() => {handleSwapSuccess(state.actualOutput)}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(sendError || receiptError) {
            //const failedReason = getFailedReason(receiptError) 
            const failedReason = 'Failed to swap. Check your network or your account if it has enough currencies'
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [sendError, receiptError])

    // output debug info
    logger.info('[SwapStep] ====== Latest state ========')
    logger.info('[SwapStep] state=', state)
    logger.info('[SwapStep] txHash =', txHash)
    logger.info('[SwapStep] isPending =', isPending, ' isSuccess =', isSuccess, '  sendError =', sendError)
    logger.info('[SwapStep] isReceiptError =', isReceiptError)
    logger.info('[SwapStep] receiptStatus =', receiptStatus)
    logger.info('[SwapStep] receiptError =', receiptError)
    logger.info('[SwapStep] receipt =', receipt)

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
                                                                                            ? 'Confirmed swap'
                                                                                            : sendError || receiptError
                                                                                                ? 'Failed to swap'
                                                                                                : 'Confirm swap in wallet'}</div>
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

export default SwapStep