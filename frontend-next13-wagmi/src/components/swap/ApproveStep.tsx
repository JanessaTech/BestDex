import SVGCheck from "@/lib/svgs/svg_check";
import SVGLockOpen from "@/lib/svgs/svg_lock_open";
import { TokenType } from "@/lib/types";
import { useEffect, useState } from "react";
import JSBI from 'jsbi'
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { useWriteContract, useReadContract } from 'wagmi'
import { ERC20 } from "@/config/abis"
import { memo } from "react";

export const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

function fromReadableAmount(amount: number, decimals: number): JSBI {
    const extraDigits = Math.pow(10, countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(adjustedAmount),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
      ),
      JSBI.BigInt(extraDigits)
    )
  }

function countDecimals(x: number) {
    if (Math.floor(x) === x) {
        return 0
    }
    return x.toString().split('.')[1].length || 0
}

type ApproveStepProps = {
    tokenFrom: TokenType;
}
const ApproveStep: React.FC<ApproveStepProps> = ({tokenFrom}) => {
    //const { data: hash, writeContract, isSuccess, isPending, error } = useWriteContract()
    const {data: message, isSuccess, isLoading, error} = useReadContract({
        abi:ERC20,
        address: tokenFrom.address,
        functionName: 'symbol'
      })

    // const handleApprove = () => {
    //     writeContract({
    //         address: tokenFrom.address,
    //         abi:ERC20,
    //         functionName: 'approve',
    //         args: [V3_SWAP_ROUTER_ADDRESS, '1000']
    //     })
    // }

    const handleReadSymbol = () => {

    }

    useEffect(() => {
        console.log('start handleApprove ...')
        //handleApprove()
    }, [])
    console.log('tokenFrom', tokenFrom.address)
    console.log('message:', message)
    

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isLoading ? '' : 'hidden'}`}/>
                <SVGLockOpen className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${isLoading ? 'text-pink-600' : 'text-zinc-400'}`}>{isLoading 
                                                                                                        ? 'Approve in wallet' 
                                                                                                        : isSuccess
                                                                                                            ? 'Approved'
                                                                                                            : 'Failed'}</div>
            </div>
            <div>
                {
                    isLoading
                    ? <></>
                    : isLoading
                        ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                        : <ToolTipHelper content={<p>{error?.message}</p>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                }  
            </div>
        </div>
    )
}

export default memo(ApproveStep)