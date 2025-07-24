import SVGCheck from "@/lib/svgs/svg_check";
import SVGLockOpen from "@/lib/svgs/svg_lock_open";
import { TokenType } from "@/lib/types";
import { useEffect, useState } from "react";
import JSBI from 'jsbi'
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { useWriteContract, useConfig, useAccount} from 'wagmi'
import { ERC20 } from "@/config/abis"
import { memo } from "react";
import { getClient } from '@wagmi/core'
import { hardhat } from '@wagmi/core/chains'
import { readContract, writeContract } from 'viem/actions'

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
    const config = useConfig()
    const {address} = useAccount()
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSucess] = useState(true)
    const [error, setError] = useState<{message: string}>()
    
    // const { data: hash, writeContract, isSuccess, isPending, error } = useWriteContract()

    // const handleApprove = () => {
    //     writeContract({
    //         address: tokenFrom.address,
    //         abi:ERC20,
    //         functionName: 'approve',
    //         args: [V3_SWAP_ROUTER_ADDRESS, '1000']
    //     })
    // }

    useEffect(() => {
        //handleApprove()
        (async () => {
            console.log('start handleApprove ...')
            await test()
        })()
        
    }, [])

    const test = async () => {
        try {
            const client = await getClient(config, {chainId : hardhat.id})
            console.log('client?.chain.id', client?.chain.id)
            const hash = await writeContract(client!, {
                address: tokenFrom.address,
                abi: ERC20,
                account: address!,
                functionName: 'approve',
                args: [V3_SWAP_ROUTER_ADDRESS, '3000']
              })
            console.log('res = ', hash)
        } catch(e) {
            console.log(e)
        }
        

    }
    console.log('address=', address)
    // console.log('tokenFrom', tokenFrom.address)
    // console.log('hash:', hash)
    // console.log('isSuccess:', isSuccess)
    // console.log('isPending:', isPending)
    // console.log('error:', error)
    

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending ? '' : 'hidden'}`}/>
                <SVGLockOpen className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${isPending ? 'text-pink-600' : 'text-zinc-400'}`}>{isPending 
                                                                                                        ? 'Approve in wallet' 
                                                                                                        : isSuccess
                                                                                                            ? 'Approved'
                                                                                                            : 'Failed'}</div>
            </div>
            <div>
                {
                    isPending
                    ? <></>
                    : isSuccess
                        ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                        : <ToolTipHelper content={<div className="w-80">{error?.message}</div>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                }  
            </div>
        </div>
    )
}

export default memo(ApproveStep)