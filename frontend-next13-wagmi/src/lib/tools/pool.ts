import { ethers} from 'ethers'
import { TokenType } from '../types'
import { MAX_TICK, MIN_TICK, TICK_BASE, TICK_RANG_PERCENTAGE, UNISWAP_V3_FACTORY_ABI, UNISWAP_V3_FACTORY_ADDRESSES } from '@/config/constants'
import { PublicClient } from 'viem'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { isZeroAddress } from './common'
import { Decimal } from 'decimal.js'
import { cookieToInitialState } from 'wagmi'

export type PoolInfo = {
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    slot0: any[];
    sqrtPriceX96: ethers.BigNumber;
    tick: number;
    liquidity: ethers.BigNumber;
    timeStamp: number;
}

export type PoolRange = {
    min: number;
    max: number;
    currentTick: number;
    lower: number;
    upper: number;
}

export const fetchPoolInfo = async (poolAddress: `0x${string}`, publicClient?: PublicClient): Promise<PoolInfo> => {
    try {
        if (!publicClient) throw new Error('publicClient is null')
        const data = await publicClient.multicall({
            contracts: [
                {
                    address: poolAddress,
                    abi: IUniswapV3PoolABI.abi,
                    functionName: 'token0'
                },
                {
                    address: poolAddress,
                    abi: IUniswapV3PoolABI.abi,
                    functionName: 'token1'
                },
                {
                    address: poolAddress,
                    abi: IUniswapV3PoolABI.abi,
                    functionName: 'fee'
                },
                {
                    address: poolAddress,
                    abi: IUniswapV3PoolABI.abi,
                    functionName: 'tickSpacing'
                },
                {
                    address: poolAddress,
                    abi: IUniswapV3PoolABI.abi,
                    functionName: 'slot0'
                },
                {
                    address: poolAddress,
                    abi: IUniswapV3PoolABI.abi,
                    functionName: 'liquidity'
                }
            ]
        })
        //console.log(data)
        if (!data[0].result 
            || !data[1].result
            || !data[2].result
            || !data[3].result
            || !data[4].result
            || !data[5].result
            ) {
                throw new Error('It failed to get full pool data')
            }
        const slot0 = data[4].result as [ethers.BigNumber, number, any, any, any, any, any]
        return {
                token0: data[0].result,
                token1: data[1].result,
                fee: data[2].result,
                tickSpacing: data[3].result,
                slot0: data[4].result,
                sqrtPriceX96 : slot0[0],
                tick: slot0[1],
                liquidity: data[5].result,
                timeStamp: Date.now()
                } as PoolInfo
    } catch (error) {
        console.log('It failed to call IUniswapV3Pool, due to:', error)
        throw error
    }
}

export const calcPoolAddress = async (tokenA:`0x${string}`, tokenB: `0x${string}`, 
    feeAmount: number, chainId: number, publicClient?: PublicClient): Promise<`0x${string}`> => {
        try {
            if (!publicClient) throw new Error('publicClient is null')
            const factoryAddress = UNISWAP_V3_FACTORY_ADDRESSES[chainId]
            if (!factoryAddress) {
                throw new Error(`No uniswap v3 factory address is found for chainId ${chainId}`)
            }
            const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() 
                    ? [tokenA, tokenB]
                    : [tokenB, tokenA]
            const poolAddress = await publicClient.readContract({
                abi: UNISWAP_V3_FACTORY_ABI,
                address: factoryAddress,
                functionName: 'getPool',
                args: [token0, token1, feeAmount]
            })
            if (isZeroAddress(poolAddress)) {
                throw new Error(`poolAddress calculated from tokenA ${tokenA}, tokenB ${tokenB}, feeAmount ${feeAmount}, chainId ${chainId} is zero`)
            }
            return poolAddress
        } catch (error)  {
            console.log('Invalid pool address due to:', error)
            throw error
        }
    }
export const calcPriceBySqrtPriceX96 = (isToken0Base: boolean, sqrtPriceX96: string, token0Decimals: number, token1Decimals: number) => {
    const sqrtPriceX96Decimal = new Decimal(sqrtPriceX96)
    const TWO_96 = new Decimal(2).pow(96)
    // price = (sqrtPriceX96 / 2^96)^2
    const sqrtRatio = sqrtPriceX96Decimal.dividedBy(TWO_96)
    const ratio = sqrtRatio.pow(2)

    // adjust
    const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0Decimals - token1Decimals) :  new Decimal(10).pow(token1Decimals - token0Decimals)
    const adjustedRatio = ratio.times(decimalsAdjustment)

    // result
    const res  = isToken0Base ? adjustedRatio : new Decimal(1).dividedBy(adjustedRatio)
    return res.toDecimalPlaces(token1Decimals, Decimal.ROUND_HALF_UP)
}

const calOriginPriceBySqrtPriceX96 = (sqrtPriceX96: string) => {
    const sqrtPriceX96Decimal = new Decimal(sqrtPriceX96)
    const TWO_96 = new Decimal(2).pow(96)
    // price = (sqrtPriceX96 / 2^96)^2
    const sqrtRatio = sqrtPriceX96Decimal.dividedBy(TWO_96)
    const ratio = sqrtRatio.pow(2)
    return ratio
}
const priceToTick = (price: Decimal, 
    isToken0Base: boolean, 
    token0Decimals: number, token1Decimals: number,
    roundDirection: 'nearest' | 'up' | 'down') => {
    const priceDecimal = isToken0Base ? new Decimal(price) : new Decimal(1).dividedBy(new Decimal(price))
    const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0Decimals - token1Decimals) : new Decimal(10).pow(token1Decimals - token0Decimals) 
    const adjustedPrice = priceDecimal.div(decimalsAdjustment);
    const tick = adjustedPrice.log().div(TICK_BASE.log());
    let roundedTick: number;
    switch (roundDirection) {
        case 'up':
        roundedTick = Math.ceil(tick.toNumber());
        break;
        case 'down':
        roundedTick = Math.floor(tick.toNumber());
        break;
        case 'nearest':
        default:
        roundedTick = Math.round(tick.toNumber());
        break;
    }
    const adjustedTick = Math.max(MIN_TICK, Math.min(MAX_TICK, roundedTick));
    return adjustedTick
}
export const calPoolRange = (poolInfo: PoolInfo, token0 : TokenType, token1: TokenType):PoolRange => {
    const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
    const currentPrice = calcPriceBySqrtPriceX96(isToken0Base, poolInfo.sqrtPriceX96.toString(), token0.decimal, token1.decimal)
    console.log('currentPrice=', currentPrice.toString())
    const lowerPrice = currentPrice.mul(1 - TICK_RANG_PERCENTAGE)
    const upperPrice = currentPrice.mul(1 + TICK_RANG_PERCENTAGE)
    console.log('lowerPrice=', lowerPrice.toString())
    console.log('upperPrice=', upperPrice.toString())
    const _lowerTick = isToken0Base ? priceToTick(lowerPrice, isToken0Base, token0.decimal, token1.decimal, 'down') : priceToTick(upperPrice, isToken0Base, token0.decimal, token1.decimal, 'down')
    const _upperTick = isToken0Base ? priceToTick(upperPrice, isToken0Base, token0.decimal, token1.decimal, 'up') : priceToTick(lowerPrice, isToken0Base, token0.decimal, token1.decimal, 'up')
    const lowerTick =  Math.floor(_lowerTick / poolInfo.tickSpacing) * poolInfo.tickSpacing
    const upperTick =  Math.ceil(_upperTick / poolInfo.tickSpacing) * poolInfo.tickSpacing
    console.log(`lowerTick=${lowerTick} tick=${poolInfo.tick} upperTick=${upperTick}`)
    const absLower = Math.abs(_lowerTick - poolInfo.tick)
    const absUpper = Math.abs(upperTick - poolInfo.tick)
    console.log('absLower=', absLower)
    console.log('absUpper=', absUpper)
    const quarterRange = Math.ceil(Math.max(absLower, absUpper) / poolInfo.tickSpacing)
    console.log('quarterRange=', quarterRange)
    const max = Math.min(MAX_TICK, upperTick + quarterRange * poolInfo.tickSpacing)
    const min = Math.max(MIN_TICK, lowerTick - quarterRange * poolInfo.tickSpacing)
    return {min: min, max: max, currentTick: poolInfo.tick, lower: lowerTick, upper: upperTick}
}

export const getPoolCurrentPrice = (poolInfo: PoolInfo, token0 : TokenType, token1: TokenType) => {
    const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
    const currentPrice = calcPriceBySqrtPriceX96(isToken0Base, poolInfo.sqrtPriceX96.toString(), token0.decimal, token1.decimal)
    return currentPrice.toString()
}

export const calcPoolPriceFromTick = (tick: number, token0 : TokenType, token1: TokenType) => {
    const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
    const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0.decimal - token1.decimal) : new Decimal(10).pow(token1.decimal - token0.decimal)
    const priceRatio = new Decimal(1.0001).pow(tick)
    const adjustedPrice = isToken0Base ? priceRatio.mul(decimalsAdjustment) : new Decimal(1).dividedBy(priceRatio.mul(decimalsAdjustment))
    const roundedPriceFromTick = adjustedPrice.toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP);
    //console.log('roundedPriceFromTick=', roundedPriceFromTick)
    return roundedPriceFromTick.toString()
}

export const isDataStale = (oldPoolInfo: PoolInfo, newPoolInfo: PoolInfo, slipage: number) => {
    console.log('oldPoolInfo=', oldPoolInfo)
    console.log('newPoolInfo=', newPoolInfo)
    if (oldPoolInfo.tick !== newPoolInfo.tick) return true
    const price_old = calOriginPriceBySqrtPriceX96(oldPoolInfo.sqrtPriceX96.toString())
    const price_new = calOriginPriceBySqrtPriceX96(newPoolInfo.sqrtPriceX96.toString())
    const diff = price_new.minus(price_old).abs().dividedBy(price_old)
    const isStale = diff.greaterThan(slipage)
    console.log('isStale=', isStale)
    return isStale
}
