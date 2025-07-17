import SVGClose from "@/lib/svgs/svg_close"
import type { TokenType } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react"
import Token from "../common/Token";

type ReviewSwapProps = {
    tokenFrom: TokenType;
    tokenTo: TokenType;
    approveAmount: number;
    quote: string;
    tokenInUSD:string;
    tokenOutUSD:string;
    setOpenModal: Dispatch<SetStateAction<boolean>>
}
const ReviewSwap: React.FC<ReviewSwapProps> = ({tokenFrom, tokenTo, approveAmount, quote, tokenInUSD, tokenOutUSD, setOpenModal}) => {

    const handleClose = () => {
        setOpenModal(false)
    }

    return (
        <div className={`fixed left-0 right-0 top-0 bottom-0 mx-auto bg-black/75 p-10 flex justify-center items-center z-50`}>
            <div className="w-80 bg-zinc-800 rounded-xl p-4 border-[1px] border-zinc-500 flex gap-y-4 flex-col">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">Review swap</div>
                    <div><SVGClose className="w-7 h-7 hover:bg-zinc-700 active:bg-zinc-700/60 rounded-full p-1 cursor-pointer" onClick={handleClose}/></div>
                </div>
                
                <div className="flex justify-between items-center bg-zinc-700/30 p-2 rounded-md">
                    <div className="flex flex-col gap-1 ">
                        <div className="text-xs text-zinc-400">You pay</div>
                        <div className="flex items-center">
                            <div className="text-xl">{approveAmount}</div>
                            <div className="px-2 text-">{tokenFrom.symbol}</div>
                        </div>
                        <div className="text-xs text-zinc-400">${tokenInUSD}</div>
                    </div>
                    <div>
                        <Token token={tokenFrom} imageSize={40} showText={false}/>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-zinc-700/30 p-2 rounded-md">
                    <div className="flex flex-col gap-1 ">
                        <div className="text-xs text-zinc-400">You will receive probably</div>
                        <div className="flex items-center">
                            <div className="text-xl">{quote}</div>
                            <div>{tokenTo.symbol}</div>
                        </div>
                        
                        <div className="text-xs text-zinc-400">${tokenOutUSD}</div>
                    </div>
                    <div>
                        <Token token={tokenTo} imageSize={40} showText={false}/>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ReviewSwap