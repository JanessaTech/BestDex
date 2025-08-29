import { ethers} from 'ethers'
import { 
    FeeAmount,
    computePoolAddress, 
    } from '@uniswap/v3-sdk'
import {Token} from '@uniswap/sdk-core'
import { 
    usePublicClient
  } from 'wagmi'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { TokenType } from '@/lib/types'
import { Decimal } from 'decimal.js'

export type PoolInfo = {
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    slot0: any[]
    sqrtPriceX96: ethers.BigNumber
    tick: number
    liquidity: ethers.BigNumber
}
const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const MIN_TICK = -887272
const MAX_TICK = 887272
const TICK_RANG_PERCENTAGE = 0.1 
const TICK_BASE = new Decimal(1.0001);

const getPriceBySqrtPriceX96 = (isToken0Base: boolean, sqrtPriceX96: string, token0Decimals: number, token1Decimals: number) => {
    const sqrtPriceX96Decimal = new Decimal(sqrtPriceX96)
    const TWO_96 = new Decimal(2).pow(96)
    // price = (sqrtPriceX96 / 2^96)^2
    const sqrtRatio = sqrtPriceX96Decimal.dividedBy(TWO_96)
    const ratio = sqrtRatio.pow(2)

    // adjust
    const decimalsAdjustment = new Decimal(10).pow(token0Decimals - token1Decimals)
    const adjustedRatio = ratio.times(decimalsAdjustment)

    return isToken0Base ? adjustedRatio : new Decimal(1).dividedBy(adjustedRatio);
}

const priceToTick = (price: Decimal, roundDirection: 'nearest' | 'up' | 'down', token0Decimals: number, token1Decimals: number) => {
    const priceDecimal = new Decimal(price);
    const decimalsAdjustment = new Decimal(10).pow(token0Decimals - token1Decimals);
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

const usePoolInfoHook = () => {
    const publicClient = usePublicClient()

    const getPoolInfo = async (token0 : TokenType, token1: TokenType, feeAmount: number): Promise<PoolInfo> => {
        try {
            if (!publicClient) throw new Error('publicClient is null')
            const feeAmount_enum = Object.values(FeeAmount).includes(feeAmount) ? feeAmount as FeeAmount : FeeAmount.MEDIUM
            console.log('feeAmount_enum=', feeAmount_enum)  // to-do: should add warning message
            const currentPoolAddress = computePoolAddress({
                factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
                tokenA: new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
                tokenB: new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
                fee: feeAmount_enum,
            })
            console.log('currentPoolAddress=', currentPoolAddress)
            if (!currentPoolAddress) throw new Error('No pool address found')
            const data = await publicClient.multicall({
                contracts: [
                    {
                        address: currentPoolAddress as `0x${string}`,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'token0'
                    },
                    {
                        address: currentPoolAddress as `0x${string}`,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'token1'
                    },
                    {
                        address: currentPoolAddress as `0x${string}`,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'fee'
                    },
                    {
                        address: currentPoolAddress as `0x${string}`,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'tickSpacing'
                    },
                    {
                        address: currentPoolAddress as `0x${string}`,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'slot0'
                    },
                    {
                        address: currentPoolAddress as `0x${string}`,
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
                    liquidity: data[5].result
                    } as PoolInfo
        } catch (error) {
            console.log('It failed to call IUniswapV3Pool, due to:', error)
            throw new Error('Failed to get pool info ')
        }
    }

    const getPoolRangeMaxMin = (poolInfo: PoolInfo, token0Decimals: number, token1Decimals: number) => {
        console.log('getPoolRangeMaxMin ...')
        const isToken0Base = poolInfo.token0.toLowerCase() < poolInfo.token1.toLowerCase()
        const currentPrice = getPriceBySqrtPriceX96(isToken0Base, poolInfo.sqrtPriceX96.toString(), token0Decimals, token1Decimals)
        console.log('currentPrice=', currentPrice)
        const lowerPrice = currentPrice.mul(1 - TICK_RANG_PERCENTAGE)
        const upperPrice = currentPrice.mul(1 + TICK_RANG_PERCENTAGE)
        console.log('lowerPrice=', lowerPrice)
        console.log('upperPrice=', upperPrice)
        const _lowerTick = priceToTick(lowerPrice, 'down', token0Decimals, token1Decimals)
        const _upperTick = priceToTick(upperPrice, 'up', token0Decimals, token1Decimals)
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
        return {max: max, min: min}
    }

    return {getPoolInfo, getPoolRangeMaxMin}
}

export default usePoolInfoHook