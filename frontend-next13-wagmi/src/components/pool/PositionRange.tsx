import { TokenType, LocalChainIds } from "@/lib/types";
import { memo, useCallback, useEffect, useState } from "react"
import Token from "../common/Token";
import PriceSelector from "./PriceSelector";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useChainId} from 'wagmi'
import { ChainId } from '@uniswap/sdk-core'
import Decimal from "decimal.js";
import { PoolInfo, getPoolCurrentPrice, calPoolRange, PoolRange } from "@/lib/tools/pool";
import SVGRefresh from "@/lib/svgs/svg_refresh";

type PositionRangeProps = {
    token0: TokenType;  //we have to make sure that token0 is the address of token0 in the pool;
    token1: TokenType;  //we have to make sure that token1 is the address of token1 in the pool;
    feeAmount: number;
    poolInfo: PoolInfo; 
    updatePoolInfo: () => Promise<void>;
    updateTicks: (lower: number, cur: number, upper: number) => void
}
const PositionRange: React.FC<PositionRangeProps> = ({token0, token1, feeAmount, poolInfo, 
                                                        updatePoolInfo, updateTicks}) => {
    const {tokenPrices} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)
    const [curPoolInfo, setCurPoolInfo] = useState({...poolInfo})
    const [curPoolRange, setCurPoolRange] = useState<PoolRange | undefined>(undefined)
    const [token0InUSDC, setToken0InUSDC] = useState('')

    useEffect(() => {
        const poolRange = calPoolRange(poolInfo, token0, token1)
        console.log('poolRange=', poolRange)
        updateUSD()
        setCurPoolInfo(poolInfo)
        setCurPoolRange({...poolRange})
    }, [poolInfo])  // it runs when the page is loaded initially or curPoolInfo is refreshed

    const updateUSD = () => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test
        const price = tokenPrices[targetChainId]?.get(token0.address)
        if (price) {
            const usdcValue = new Decimal(price).times(1)
            setToken0InUSDC(usdcValue.toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString())
        }
    }

    // for debug
    const checkPoolInfo = () => {
        console.log('poolInfo used in position=', poolInfo)
    }

    return (
        <div>
            <div className="pb-2 flex justify-between items-center">
                <span>Set position range</span>
                <div>
                    <div className="flex items-center">
                        <div className="text-xs text-white font-semibold">Refresh</div>
                        <SVGRefresh className="size-6 text-white hover:text-pink-600 active:text-pink-500 cursor-pointer" onClick={updatePoolInfo}/>
                    </div>
                </div>
            </div>
            <div className="flex items-center text-xs flex-wrap">
                 <div className="text-zinc-200">Market price: </div> 
                 {
                    token0 && token1 && <><div className="text-pink-600">{getPoolCurrentPrice(curPoolInfo, token0, token1)} {token1 ? token1.symbol : ''} = 1 {token0 ? token0.symbol : ''}</div>
                    <div className="text-zinc-200">(${token0InUSDC})</div></>
                 }
                 
             </div>
            <div className="w-full h-fit rounded-md bg-zinc-600/30">
                <div>
                    <div className="flex justify-end py-2 items-center text-xs">
                        <div className="bg-zinc-500 text-white rounded-full px-1 border-[1px] cursor-pointer" onClick={checkPoolInfo}>poolInfo</div>
                        <span className="px-1">fee={feeAmount/10000}%</span>
                        <Token token={token0} imageSize={25} textSize="text-xs"/>
                        <Token token={token1} imageSize={25} textSize="text-xs"/>
                    </div> 
                    {
                        curPoolRange
                        ? <PriceSelector
                            poolRange={curPoolRange}
                            marketPrice={getPoolCurrentPrice(curPoolInfo, token0, token1)}
                            tickSpacing={curPoolInfo.tickSpacing}
                            token0={token0}
                            token1={token1}
                            updateTicks={updateTicks}
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

export default memo(PositionRange)