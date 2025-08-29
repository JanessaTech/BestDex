import { TokenType, LocalChainIds } from "@/lib/types";
import { memo, useCallback, useEffect, useState } from "react"
import Token from "../common/Token";
import PriceSelector from "./PriceSelector";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useChainId} from 'wagmi'
import { ChainId } from '@uniswap/sdk-core'
import { PoolInfo } from "@/hooks/usePoolInfoHook";

type PriceRangeProps = {
    token0: TokenType;
    token1: TokenType;
    feeAmount: number;
    poolInfo: PoolInfo; 
}
const PriceRange: React.FC<PriceRangeProps> = ({token0, token1, feeAmount, poolInfo}) => {
    //const {tokenPrices} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)
    const [max, setMax] = useState(1000)
    const [min, setMin] = useState(0)
    const {getPoolRangeMaxMin} = useContextUtil() as IContextUtil
    const [poolState, setPoolState] = useState<{max?: number, min?: number , poolInfo: PoolInfo}>({poolInfo: poolInfo})
   
    useEffect(() => {
        const poolRange = getPoolRangeMaxMin(poolInfo, token0.decimal, token1.decimal)
        console.log('poolRange=', poolRange)
        setPoolState({...poolState, ... poolRange})
    }, [])
    
    const updateMinMax = useCallback((min: number, max: number) => {
        console.log('updateMinMax:', 'min=', min, ' max=', max)
        setPoolState({...poolState, max: max, min: min})
    }, [])

    return (
        <div>
            <div className="pb-2">Set price range</div>
            <div className="flex items-center text-xs flex-wrap">
                 <div className="text-zinc-200">Market price: </div> 
                 {
                    token0 && token1 && <><div className="text-pink-600">335.376 {token1 ? token1.symbol : ''} = 1 {token0 ? token0.symbol : ''}</div>
                    <div className="text-zinc-200">($2,573.22)</div></>
                 }
                 
             </div>
            <div className="w-full h-fit rounded-md bg-zinc-600/30">
                <div>
                    <div className="flex justify-end py-2">
                        <Token token={token0} imageSize={25} textSize="text-xs"/>
                        <Token token={token1} imageSize={25} textSize="text-xs"/>
                    </div> 
                    {
                        poolState.max !== undefined && poolState.min !== undefined 
                        ? <PriceSelector 
                            min={min} 
                            max={max} 
                            token0={token0}
                            token1={token1}
                            updateMinMax={updateMinMax}
                            /> 
                        : <div className="flex justify-center py-6 relative">
                            <div className="size-10 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute top-[14px]"></div>
                                <span>Loading price selector</span>
                           </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default memo(PriceRange)