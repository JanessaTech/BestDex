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
import { TICK_BASE, 
         MIN_TICK, MAX_TICK, 
         TICK_RANG_PERCENTAGE, POOL_FACTORY_CONTRACT_ADDRESS,
         UNISWAP_V3_FACTORY_ADDRESSES,
         UNISWAP_V3_FACTORY_ABI} from '@/config/constants'
import { isZeroAddress } from '@/lib/utils'

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


const getPriceBySqrtPriceX96 = (isToken0Base: boolean, sqrtPriceX96: string, token0Decimals: number, token1Decimals: number) => {
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

const usePoolHook = () => {
    const publicClient = usePublicClient()

    const getPoolAddress = async (tokenA:`0x${string}`, tokenB: `0x${string}`, 
                                   feeAmount: number, chainId: number): Promise<string | undefined> => {
        try {
            const factoryAddress = UNISWAP_V3_FACTORY_ADDRESSES[chainId]
            if (!factoryAddress) {
                throw new Error(`No uniswap v3 factory address is found for chainId ${chainId}`)
            }
            if (!publicClient) throw new Error('publicClient is null')
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
                return undefined
            }
            return poolAddress
        } catch (error)  {
            console.log('Failed to check pool existence:', error)
        }

        return undefined
    }

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

    const getPoolCurrentPrice = (poolInfo: PoolInfo, token0 : TokenType, token1: TokenType) => {
        const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
        const currentPrice = getPriceBySqrtPriceX96(isToken0Base, poolInfo.sqrtPriceX96.toString(), token0.decimal, token1.decimal)
        return currentPrice.toString()
    }

    const getPoolPriceFromTick = (tick: number, token0 : TokenType, token1: TokenType) => {
        const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
        const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0.decimal - token1.decimal) : new Decimal(10).pow(token1.decimal - token0.decimal)
        const priceRatio = new Decimal(1.0001).pow(tick)
        const adjustedPrice = isToken0Base ? priceRatio.mul(decimalsAdjustment) : new Decimal(1).dividedBy(priceRatio.mul(decimalsAdjustment))
        const roundedPriceFromTick = adjustedPrice.toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP);
        //console.log('roundedPriceFromTick=', roundedPriceFromTick)
        return roundedPriceFromTick.toString()
    }

    const getPoolRangeMaxMin = (poolInfo: PoolInfo, token0 : TokenType, token1: TokenType) => {
        const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
        const currentPrice = getPriceBySqrtPriceX96(isToken0Base, poolInfo.sqrtPriceX96.toString(), token0.decimal, token1.decimal)
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
        return {max: max, min: min, lower: lowerTick, upper: upperTick}
    }

    return {
            getPoolAddress,
            getPoolInfo, 
            getPoolRangeMaxMin, 
            getPoolCurrentPrice, 
            getPoolPriceFromTick}
}

export default usePoolHook