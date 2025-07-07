import { TokenType } from "@/lib/types";
import { useState } from "react"
import Token from "../common/Token";
import PriceSelector from "./PriceSelector";

type PriceRangeProps = {
    token1: TokenType | undefined;
    token2: TokenType | undefined
}
const PriceRange: React.FC<PriceRangeProps> = ({token1, token2}) => {
    const [max, setMax] = useState(1000)
    const [min, setMin] = useState(0)

    const updateMinMax = (min: number, max: number) => {
        console.log('updateMinMax:', 'min=', min, ' max=', max)
        setMin(min)
        setMax(max)
    }

    return (
        <div>
            <div className="pb-2">Set price range</div>
            <div className="flex items-center text-xs flex-wrap">
                 <div className="text-zinc-200">Market price: </div> 
                 {
                    token1 && token2 && <><div className="text-pink-600">335.376 {token2 ? token2.symbol : ''} = 1 {token1 ? token1.symbol : ''}</div>
                    <div className="text-zinc-200">($2,573.22)</div></>
                 }
                 
             </div>
            <div className="w-full h-fit rounded-md bg-zinc-600/30">
                <div>
                    <div className="flex justify-end py-2">
                        <Token token={token1} imageSize={25} textSize="text-xs"/>
                        <Token token={token2} imageSize={25} textSize="text-xs"/>
                    </div> 
                    <PriceSelector 
                        min={min} 
                        max={max} 
                        token1={token1}
                        token2={token2}
                        updateMinMax={updateMinMax}
                        /> 
                </div>
            </div>
        </div>
    )
}

export default PriceRange