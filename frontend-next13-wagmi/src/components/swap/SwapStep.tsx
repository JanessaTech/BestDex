import SVGCheck from "@/lib/svgs/svg_check"
import SVGCheckCircle from "@/lib/svgs/svg_check_circle"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

type SwapStepProps = {
    started: boolean,
    calldata: `0x${string}`;
    setShowSwapSuccess: Dispatch<SetStateAction<boolean>>
}
const SwapStep:React.FC<SwapStepProps> = ({started, calldata, setShowSwapSuccess}) => {
    const { data: txHash, sendTransaction, isPending, error, isSuccess} = useSendTransaction()
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
        if (isSuccess && started) {
            console.log('isSuccess =', isSuccess)
            setInterval(() => {setShowSwapSuccess(true)}, 1000)
        }
    }, [isSuccess])


    console.log('[SwapStep] isPending=', isPending, ' isSuccess=', isSuccess)
    console.log('[SwapStep] swap tx hash =', txHash)
    console.log('[SwapStep] swap tx error =', error)
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
                                                                                        : 'Failed tp swap'
                                                                                : 'Confirm swap in wallet'}</div>
                </div>
                <div>
                    {
                        started
                        ? isPending
                            ? <></>
                            : isSuccess
                                ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                                : error 
                                    ? <ToolTipHelper content={<div className="w-80">{error?.message}</div>}>
                                        <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                                      </ToolTipHelper>
                                    : <></>
                        : <></>
                        
                    }  
                </div>
        </div>  
    )
}

export default SwapStep