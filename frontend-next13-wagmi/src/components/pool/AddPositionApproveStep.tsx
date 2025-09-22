import SVGSign from "@/lib/svgs/svg_sign"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"
import { useWriteContract} from 'wagmi'
import { ERC20 } from "@/config/abis"
import { TokenType } from "@/lib/types"
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from "@/config/constants"
import { fromReadableAmount3 } from "@/lib/utils"

type AddPositionApproveStepProps = {
    token0: TokenType;
    token1: TokenType;
    token0Input:string;
    token1Input:string;
    started: boolean;
    done: boolean;
    skip: boolean;
    goNext: () => void
}
const AddPositionApproveStep:React.FC<AddPositionApproveStepProps> = ({token0, token1, token0Input, token1Input, started, done, skip, goNext}) => {
    const { data: hash, writeContract, isSuccess, isPending, error } = useWriteContract()

    const handleApprove = () => {
        writeContract({
            address: token0.address,
            abi:ERC20,
            functionName: 'approve',
            args: [NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, fromReadableAmount3(token0Input, token0.decimal).toString()]
        })
    }


    useEffect(() => {
        let timer = undefined
        if (started) {
            console.log('[AddPositionApproveStep] it will run refetchSimulation in 1000 milliseconds')
            timer = setTimeout(() => {
                console.log('[AddPositionApproveStep] it will run handleApprove')
                handleApprove()
                // setIsPending(false)
                // setIsSuccess(true)
            }, 1000)
        }     
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [started])

    useEffect(() => {
        let timer = undefined
        if (isSuccess) {
            console.log('it will goNext in 1000 milliseconds')
            timer = setTimeout(() => {goNext()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])

    console.log('[AddPositionApproveStep] isSuccess=', isSuccess, ' isPending=', isPending)

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending && started ? '' : 'hidden'}`}/>
                <SVGSign className="text-white size-4 ml-[4px]"/>
                <div className="text-xs pl-4 text-pink-600">Approve in wallet</div>
            </div>
            {
                done
                ? isPending
                    ? <></>
                    : isSuccess
                        ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                        : <ToolTipHelper content={<div className="w-80">error?.message</div>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                : <></>
            }  
        </div>
    )
}

export default AddPositionApproveStep