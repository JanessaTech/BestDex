import SVGCheck from "@/lib/svgs/svg_check"
import SVGCheckCircle from "@/lib/svgs/svg_check_circle"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useSendTransaction, 
         useWaitForTransactionReceipt } from 'wagmi'
import {WaitForTransactionReceiptErrorType} from "@wagmi/core"
import { UNISWAP_ERRORS, V3_SWAP_ROUTER_ADDRESS } from "@/config/constants"

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
    started: boolean,
    calldata: `0x${string}`;
    setShowSwapSuccess: Dispatch<SetStateAction<boolean>>
}
const SwapStep:React.FC<SwapStepProps> = ({started, calldata, setShowSwapSuccess}) => {
    const [reason, setReason] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const { data: txHash, sendTransaction} = useSendTransaction()
    const {data: receipt, isError, error: receiptError, status: receiptStatus, refetch: refetchReceipt} = useWaitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
        query: {
            enabled: false,
            gcTime: 0,  // disable cache
            staleTime: 0  // disable cache
        }
    })

    const handleSendTransation = () => {
        sendTransaction({
            to: V3_SWAP_ROUTER_ADDRESS,
            data: calldata,
        })
    }

    useEffect(() => {
        if (started) {
            console.log('[SwapStep] it will send swap tx')
            setIsPending(true)
            handleSendTransation()  
        }
    }, [started])

    useEffect(() => {
        if (txHash) {
            console.log('[SwapStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [txHash])

    useEffect(() => {
        if (!txHash || !receipt) return
        let timer = undefined
        if (receipt.status === 'success') {
            console.log('[SwapStep] swap is successful')
            setIsPending(false)
            setIsSuccess(true)
            timer = setTimeout(() => {
                setShowSwapSuccess(true)
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [receipt, txHash])

    useEffect(() => {
        if(receiptError) {
            const failedReason = getFailedReason(receiptError)
            setIsPending(false)
            setIsSuccess(false)
            setReason(failedReason)
        }
    }, [receiptError])

    // output debug info
    console.log('[SwapStep] isPending=', isPending, ' isSuccess=', isSuccess)
    console.log('[SwapStep] swap tx hash =', txHash)
    console.log('[SwapStep][useWaitForTransactionReceipt] isError =', isError)
    console.log('[SwapStep][useWaitForTransactionReceipt] receiptStatus =', receiptStatus)
    console.log('[SwapStep][useWaitForTransactionReceipt] receiptError =', receiptError)
    console.log('[SwapStep][useWaitForTransactionReceipt] receipt =', receipt)

    return (
        <div className="flex justify-between items-center">
                <div className="flex items-center relative">
                    <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending && started ? '' : 'hidden'}`}/>
                    <SVGCheckCircle className="text-white size-5 ml-[2px]"/>
                    <div className={`text-xs pl-3 ${started 
                                                        ? isPending
                                                            ? 'text-pink-600' 
                                                            : isSuccess 
                                                                ? 'text-zinc-400'
                                                                : 'text-red-600'
                                                        : 'text-zinc-400'}`}>{started
                                                                                ? isPending
                                                                                    ? 'Confirm swap in wallet'
                                                                                    : isSuccess
                                                                                        ? 'Confirmed swap'
                                                                                        : 'Failed to swap'
                                                                                : 'Confirm swap in wallet'}</div>
                </div>
                <div>
                    {
                        started
                        ? isPending
                            ? <></>
                            : isSuccess
                                ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                                : <ToolTipHelper content={<div className="w-80">{reason}</div>}>
                                    <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                                  </ToolTipHelper>
                        : <></>
                        
                    }  
                </div>
        </div>  
    )
}

export default SwapStep