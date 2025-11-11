import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { memo, useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"
import { useWriteContract} from 'wagmi'
import { ERC20 } from "@/config/abis"
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from "@/config/constants"
import SVGLockOpen from "@/lib/svgs/svg_lock_open"
import { fromReadableAmount3 } from "@/common/utils"
import { TokenType } from "@/common/types"
import logger from "@/common/Logger"

type AddPositionApproveStepProps = {
    token: TokenType;
    tokenInput:string;
    started: boolean;
    done: boolean;
    skip: boolean;
    goNext: () => void
}
const AddPositionApproveStep:React.FC<AddPositionApproveStepProps> = ({token, tokenInput, started, done, skip, goNext}) => {
    const [localSuccess, setLocalSuccess] = useState(false);
    const { data: hash, writeContract, isSuccess: isWriteSuccess, isPending, error } = useWriteContract()
    
    const shouldSkip  = tokenInput === '0' || !tokenInput 
    const isSuccess = shouldSkip ? localSuccess : isWriteSuccess

    const handleApproveToken = () => {
        writeContract({
            address: token.address,
            abi:ERC20,
            functionName: 'approve',
            args: [NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, fromReadableAmount3(tokenInput, token.decimal).toString()]
        })
    }


    useEffect(() => {
        let timer = undefined
        if (started) {
            timer = setTimeout(() => {
                if (shouldSkip) {
                    logger.info('[AddPositionApproveStep] skip approval')
                    setLocalSuccess(true)
                } else {
                    logger.info('[AddPositionApproveStep] it will run handleApprove')
                    handleApproveToken()
                }
            }, 1000);
            
        }
        return () => {
            if (timer) clearTimeout(timer)
        }    
    }, [started])

    useEffect(() => {
        let timer = undefined
        if (isSuccess) {
            logger.info('it will goNext in 1000 milliseconds')
            timer = setTimeout(() => {goNext()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])
    logger.debug('[AddPositionApproveStep] shouldSkip=', shouldSkip)
    logger.debug('[AddPositionApproveStep]', 'isSuccess=', isSuccess, ' isPending=', isPending)
    logger.debug('[AddPositionApproveStep] error=', error, ' hash=', hash)

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending ? '' : 'hidden'}`}/>
                <SVGLockOpen className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${isSuccess
                                                ? 'text-zinc-400'  
                                                : error
                                                    ? 'text-red-600'
                                                    : 'text-pink-600'}`}>{isSuccess
                                                                                ? `Approved ${token.symbol}${shouldSkip ? ' (skipped)' : ''}` 
                                                                                :   error
                                                                                    ?  `Failed to approve ${token.symbol}`
                                                                                    : `Approve ${token.symbol} in wallet`                                                   
                                                                                    }</div>
            </div>
            {
                done
                ?  isSuccess
                   ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                   : error
                        ? <ToolTipHelper content={<div className="w-80">{error.message}</div>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                        : <></>
                   
                : <></>
            }  
        </div>
    )
}

export default memo(AddPositionApproveStep)