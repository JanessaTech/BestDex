import { memo } from "react"
import SVGClose from "@/lib/svgs/svg_close"
import type { LocalChainIds, TokenType } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react"
import Token from "../common/Token";
import { Button } from "@/components/ui/button"
import { Decimal } from 'decimal.js'
import { toast } from "sonner"
import { useChainId} from 'wagmi'
import { ChainId } from '@uniswap/sdk-core'
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import SwapeExecutor from "./SwapExecutor";
import SVGCheck from "@/lib/svgs/svg_check";
import ArrowRight from "@/lib/svgs/svg_arrow_right";
import Link from "next/link";

type SwapSuccessProps = {
    tokenFrom: TokenType;
    tokenTo: TokenType;
}
const SwapSuccess:React.FC<SwapSuccessProps> = ({tokenFrom, tokenTo}) => {
    return (
        <div className="flex flex-col gap-y-4 items-center">
            <div className="py-3">
                <SVGCheck className="text-white bg-green-600 size-14 p-2 rounded-full"/>
            </div>
            <div className="font-semibold">Swap success!</div>
            <div className="flex items-center">
                <div className="flex items-center">
                    <div className="pr-2 text-pink-600">10</div><Token token={tokenFrom} imageSize={20}/>
                </div>
                <ArrowRight className="w-3 h-3 mx-1"/>
                <div className="flex items-center">
                    <div className="pr-2 text-pink-600">15</div><Token token={tokenTo} imageSize={20}/>
                </div>
            </div>
            <div><Link href="www.baidu.com" className="text-xs text-pink-600">View details</Link></div>
        </div>
    )
}

type ReviewSwapProps = {
    tokenFrom: TokenType;
    tokenTo: TokenType;
    swapAmount: string;
    quote: string;
    tokenInUSD: string;
    tokenOutUSD:string;
    setOpenModal: Dispatch<SetStateAction<boolean>>
}
const ReviewSwap: React.FC<ReviewSwapProps> = ({tokenFrom, tokenTo, swapAmount, quote, tokenInUSD, tokenOutUSD, setOpenModal}) => {
    const [approveAmount, setApproveAmount] = useState(swapAmount)
    const [inputUSD, setInputUSD] = useState(tokenInUSD)
    const [approved, setApproved] = useState(false)
    const [showSwapSuccess, setShowSwapSuccess] = useState(false)
    const {tokenPrices} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)
    const handleClose = () => {
        setOpenModal(false)
    }

    const checkApproveAmount = () => {
        if (!approveAmount || new Decimal(approveAmount).lessThan(new Decimal(swapAmount))) {
            return false
        }
        return true
    }

    const handleApprove = () => {
        const valid = checkApproveAmount()
        if (!valid) {
            toast.warning(`The value you will approve must be equal to or greater than ${swapAmount}`)
            return
        }
        setApproved(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApproveAmount(e.target.value)
        calcUSD(e.target.value)
    }

    const calcUSD = (input: string) => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId  // for test
        const inPrice = tokenPrices[targetChainId]?.get(tokenFrom?.address)
        if (inPrice && input) {
            const heldValue = new Decimal(inPrice).times(new Decimal(input))
            setInputUSD(heldValue.toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString())
        } else {
            setInputUSD('0')
        }
    }

    return (
        <div className={`fixed left-0 right-0 top-0 bottom-0 mx-auto bg-black/75 p-10 flex justify-center items-center z-50`}>
            <div className=" bg-zinc-800 rounded-xl p-4 border-[1px] border-zinc-500 flex gap-y-4 flex-col min-w-[300px]">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">Review swap</div>
                    <div><SVGClose className="w-7 h-7 hover:bg-zinc-700 active:bg-zinc-700/60 rounded-full p-1 cursor-pointer" onClick={handleClose}/></div>
                </div>
                {
                    showSwapSuccess
                    ? <SwapSuccess tokenFrom={tokenFrom} tokenTo={tokenTo}/>
                    :   <div className="flex flex-col gap-y-4">
                            <div className="flex justify-between items-center bg-zinc-700/30 p-2 rounded-md">
                                <div className="flex flex-col gap-1 ">
                                    <div className="text-xs text-zinc-400">You pay</div>
                                    <div className="flex items-center text-xl">
                                        <input className="px-3 bg-inherit max-md:w-36"
                                        value={approveAmount}
                                        onChange={handleInputChange}
                                        onKeyDown={(event) => {
                                            const regex1 = new RegExp(`^[1-9]\\d{0,14}\\.\\d{0,${tokenFrom ? tokenFrom.decimal - 1 : '17'}}$`);
                                            const regex2 = new RegExp(`^0\\.\\d{0,${tokenFrom ? tokenFrom.decimal - 1 : '17'}}$`);
                                            const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                                                        || (approveAmount === '' && event?.key >= '0' && event?.key <= '9')
                                                        || (approveAmount === '0' && event?.key === '.')
                                                        || (/^[1-9]\d{0,13}$/.test(approveAmount) && event?.key >= '0' && event?.key <= '9')
                                                        || (/^[1-9]\d{0,14}$/.test(approveAmount) && event?.key === '.')
                                                        || (regex1.test(approveAmount) && event?.key >= '0' && event?.key <= '9') //(/^[1-9]\d{0,14}\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                                                        || (regex2.test(approveAmount) && event?.key >= '0' && event?.key <= '9')  //(/^0\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                                            if (!allow) {
                                                event.preventDefault(); 
                                            }
                                        }}
                                    >
                                        </input>
                                        <div className="px-2 text-sm">{tokenFrom.symbol}</div>
                                    </div>
                                    <div className="text-xs text-zinc-400">${inputUSD}</div>
                                </div>
                                <div>
                                    <Token token={tokenFrom} imageSize={40} showText={false}/>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-zinc-700/30 p-2 rounded-md">
                                <div className="flex flex-col gap-1 ">
                                    <div className="text-xs text-zinc-400">You will receive probably</div>
                                    <div className="flex items-center">
                                        <div className="text-xl max-md:w-36 truncate">{quote}</div>
                                        <div className="px-2 text-sm">{tokenTo.symbol}</div>
                                    </div>
                                    
                                    <div className="text-xs text-zinc-400">${tokenOutUSD}</div>
                                </div>
                                <div>
                                    <Token token={tokenTo} imageSize={40} showText={false}/>
                                </div>
                            </div>
                            {
                                !approved
                                ? <div className='flex justify-center'>
                                    <Button 
                                    className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600 active:bg-pink-700/80' 
                                    onClick={handleApprove}>Approve and swap
                                    </Button>
                                </div>
                                : <SwapeExecutor tokenFrom={tokenFrom} setShowSwapSuccess={setShowSwapSuccess}/>
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default memo(ReviewSwap)