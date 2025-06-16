import SVGMinus from "@/lib/svgs/svg_minus"
import SVGPlus from "@/lib/svgs/svg_plus"
import { TokenType } from "@/lib/types";
import { useState } from "react"
import { spanish } from "viem/accounts";

type PriceRangeProps = {
    token1: TokenType | undefined;
    token2: TokenType | undefined
}
const PriceRange: React.FC<PriceRangeProps> = ({token1, token2}) => {
    const [max, setMax] = useState('')
    const [min, setMin] = useState('')

    const plusMin = () => {

    }
    const plusMax = () => {
        
    }
    const minusMin = () => {

    }
    const minusMax = () => {

    }

    return (
        <div className="py-5">
            <div className="pb-2">Set price range</div>
            <div className="grid md:grid-cols-2 gap-3">
                <div className="border-[1px] border-zinc-700 rounded-l-md rounded-r-md md:rounded-r-none flex justify-between items-center p-4">
                    <div className="flex flex-col justify-between text-xs">
                        <div>Min price</div>
                        <input type="text" className="w-28 bg-inherit text-base py-3"/>
                        <div>{token1 && token2 ? <span>{`${token2?.label} = 1 ${token1?.label}`}</span> : <span></span>}</div>
                    </div>
                    <div>
                        <SVGMinus 
                            onClick={minusMin}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500"/>
                        <SVGPlus 
                            onClick={plusMin}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500 mt-2"/>
                    </div>
                </div>
                <div className="border-[1px] border-zinc-700 rounded-r-md rounded-l-md md:rounded-l-none flex justify-between items-center p-4">
                    <div className="flex flex-col justify-between text-xs">
                        <div>Max price</div>
                        <input type="text" className="w-28 bg-inherit text-base py-3"/>
                        <div>{token1 && token2 ? <span>{`${token2?.label} = 1 ${token1?.label}`}</span> : <span></span>}</div>
                    </div>
                    <div>
                        <SVGMinus 
                            onClick={minusMax}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500"/>
                        <SVGPlus 
                            onClick={plusMax}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500 mt-2"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PriceRange