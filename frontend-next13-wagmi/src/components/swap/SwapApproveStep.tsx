import SVGCheck from "@/lib/svgs/svg_check";
import SVGLockOpen from "@/lib/svgs/svg_lock_open";
import { TokenType } from "@/lib/types";
import { useEffect} from "react";
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { useWriteContract} from 'wagmi'
import { ERC20 } from "@/config/abis"
import { memo } from "react";
import { fromReadableAmount3 } from "@/lib/utils";
import { V3_SWAP_ROUTER_ADDRESS } from "@/config/constants";

type SwapApproveStepProps = {
    tokenFrom: TokenType;
    approveAmount: string;
    goNext: () => void
}
const SwapApproveStep: React.FC<SwapApproveStepProps> = ({tokenFrom, approveAmount, goNext}) => {

    const { data: hash, writeContract, isSuccess, isPending, error } = useWriteContract()

    const handleApprove = () => {
        writeContract({
            address: tokenFrom.address,
            abi:ERC20,
            functionName: 'approve',
            args: [V3_SWAP_ROUTER_ADDRESS, fromReadableAmount3(approveAmount, tokenFrom.decimal).toString()]
        })
    }

    useEffect(() => {
        handleApprove()
    }, [])

    useEffect(() => {
        let timer = undefined
        if (isSuccess) {
            console.log('[SwapApproveStep] it will goNext in 1000 milliseconds')
            timer = setTimeout(() => {goNext()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])

    console.log('[SwapApproveStep] ======= Latest state =======')
    console.log('[SwapApproveStep] isSuccess=', isSuccess, ' isPending=', isPending)
    console.log('[SwapApproveStep] hash =', hash)
    console.log('[SwapApproveStep] error =', error)
    
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending ? '' : 'hidden'}`}/>
                <SVGLockOpen className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${isSuccess 
                                                ? 'text-zinc-400' 
                                                : error
                                                    ? 'text-red-600'
                                                    : 'text-pink-600'}`}>{isSuccess ? 'Approved' 
                                                                                      : error
                                                                                           ? 'Failed to approve'
                                                                                           : `Approve ${tokenFrom.symbol} in wallet`}</div>
            </div>
            <div>
                {
                    isSuccess
                    ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                    : error
                        ? <ToolTipHelper content={<div className="w-80">{error?.message}</div>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                        : <></>
                }  
            </div>
        </div>
    )
}

export default memo(SwapApproveStep)