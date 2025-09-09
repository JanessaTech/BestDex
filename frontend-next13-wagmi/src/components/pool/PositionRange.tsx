import { TokenType, LocalChainIds } from "@/lib/types";
import { memo, useCallback, useEffect, useState } from "react"
import Token from "../common/Token";
import PriceSelector from "./PriceSelector";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useChainId} from 'wagmi'
import { ChainId } from '@uniswap/sdk-core'
import Decimal from "decimal.js";
import { PoolInfo, getPoolCurrentPrice, getPoolRangeMaxMin } from "@/lib/tools/pool";
import SVGRefresh from "@/lib/svgs/svg_refresh";
import ToolTipHelper from "../common/ToolTipHelper";

type PositionRangeProps = {
    token0: TokenType;  //we have to make sure that token0 is the address of token0 in the pool;
    token1: TokenType;  //we have to make sure that token1 is the address of token1 in the pool;
    feeAmount: number;
    poolInfo: PoolInfo; 
    updateTicks: (lower: number, cur: number, upper: number) => void
}
const PositionRange: React.FC<PositionRangeProps> = ({token0, token1, feeAmount, poolInfo, updateTicks}) => {
    const {tokenPrices, getLatestPoolInfo, getPoolAddress} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)
    const [curPoolInfo, setCurPoolInfo] = useState({...poolInfo})
    const [poolState, setPoolState] = useState<{max?: number, min?: number, lower?: number, upper?: number, poolInfo: PoolInfo}>({poolInfo: poolInfo})
    const [token0InUSDC, setToken0InUSDC] = useState('')

    useEffect(() => {
        const poolRange = getPoolRangeMaxMin(poolInfo, token0, token1)
        console.log('poolRange=', poolRange)
        updateUSD()
        setPoolState({...poolState, ... poolRange})
    }, [curPoolInfo])  // it runs when the page is loaded initially or curPoolInfo is updated

    const updateUSD = () => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test
        const price = tokenPrices[targetChainId]?.get(token0.address)
        if (price) {
            const usdcValue = new Decimal(price).times(1)
            setToken0InUSDC(usdcValue.toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString())
        }
    }

    const updateMinMax = useCallback((min: number, max: number) => {
        console.log('updateMinMax:', 'min=', min, ' max=', max)
        setPoolState({...poolState, max: max, min: min})
    }, [])

    const updatePoolInfo = async () => {
        try {
            const poolAddress = await getPoolAddress(token0?.address!, token1?.address!, feeAmount)
            const poolInfo = await getLatestPoolInfo(poolAddress)
            if (poolInfo) {
                setCurPoolInfo({...poolInfo})
                console.log(`Get the latest poolInfo from the pool address ${poolAddress}`)
                console.log('poolInfo =', poolInfo)
            } else {
                console.log('No cached poolInfo in websocket yet, try it later on...')
            }
        } catch (error) {
            console.log('Failed to update poolInfo due to:', error)
        }
    }

    return (
        <div>
            <div className="pb-2 flex justify-between items-center">
                <span>Set position range</span>
                <div>
                    <ToolTipHelper content="Refresh">
                    <SVGRefresh className="size-6 text-white hover:text-pink-600 active:text-pink-500 cursor-pointer" onClick={updatePoolInfo}/>
                    </ToolTipHelper>
                </div>
            </div>
            <div className="flex items-center text-xs flex-wrap">
                 <div className="text-zinc-200">Market price: </div> 
                 {
                    token0 && token1 && <><div className="text-pink-600">{getPoolCurrentPrice(poolInfo, token0, token1)} {token1 ? token1.symbol : ''} = 1 {token0 ? token0.symbol : ''}</div>
                    <div className="text-zinc-200">(${token0InUSDC})</div></>
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
                            min={poolState.min} 
                            max={poolState.max} 
                            lower={poolState.lower!}
                            upper={poolState.upper!}
                            cur={poolState.poolInfo.tick}
                            marketPrice={getPoolCurrentPrice(poolInfo, token0, token1)}
                            tickSpacing={poolState.poolInfo.tickSpacing}
                            token0={token0}
                            token1={token1}
                            updateMinMax={updateMinMax}
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