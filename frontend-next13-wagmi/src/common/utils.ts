import JSBI from 'jsbi'
import { Decimal } from 'decimal.js';
import { parseUnits, PublicClient} from 'viem'
import { MAX_TICK, MIN_TICK, TICK_BASE, TICK_RANG_PERCENTAGE, UNISWAP_V3_FACTORY_ABI, UNISWAP_V3_FACTORY_ADDRESSES, ZERO_ADDRESS } from '@/config/constants';
import { PoolRange, TokenType } from './types';
import logger from './Logger';
import { PoolInfo } from '@/lib/client/types';

Decimal.set({
    toExpNeg: -1e15, 
    toExpPos: 1e15 
  });

// bugs
export function fromReadableAmount(amount: number, decimals: number): JSBI {
    const extraDigits = Math.pow(10, countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(adjustedAmount),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
      ),
      JSBI.BigInt(extraDigits)
    )
  }

function countDecimals(x: number) {
    if (Math.floor(x) === x) {
        return 0
    }
return x.toString().split('.')[1].length || 0
}


export function fromReadableAmount2(amount: string, decimals: number) : string {
    const res = new Decimal(amount ? amount : 0).mul(new Decimal(10).pow(decimals)).toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP).toString()
    return res
  }

// bug：fix when amount is empty or undefined
export function fromReadableAmount3(amount: string, decimals: number) : JSBI {
    return JSBI.BigInt(parseUnits(amount, decimals).toString())
  }

export function isZeroAddress(address: `0x${string}`) {
  return address.toLowerCase() === ZERO_ADDRESS.toLowerCase();
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
          logger.error('[util.calcPoolAddress] Invalid pool address due to:', error)
          throw error
      }
  }

const calcPriceBySqrtPriceX96 = (isToken0Base: boolean, sqrtPriceX96: string, token0Decimals: number, token1Decimals: number) => {
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

export const getPoolCurrentPrice = (poolInfo: PoolInfo, token0 : TokenType, token1: TokenType) => {
  const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
  const currentPrice = calcPriceBySqrtPriceX96(isToken0Base, poolInfo.sqrtPriceX96, token0.decimal, token1.decimal)
  return currentPrice.toString()
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
  const currentPrice = calcPriceBySqrtPriceX96(isToken0Base, poolInfo.sqrtPriceX96, token0.decimal, token1.decimal)
  logger.debug('[util.calPoolRange] currentPrice=', currentPrice.toString())
  const lowerPrice = currentPrice.mul(1 - TICK_RANG_PERCENTAGE)
  const upperPrice = currentPrice.mul(1 + TICK_RANG_PERCENTAGE)
  logger.debug('[util.calPoolRange] lowerPrice=', lowerPrice.toString())
  logger.debug('[util.calPoolRange] upperPrice=', upperPrice.toString())
  const _lowerTick = isToken0Base ? priceToTick(lowerPrice, isToken0Base, token0.decimal, token1.decimal, 'down') : priceToTick(upperPrice, isToken0Base, token0.decimal, token1.decimal, 'down')
  const _upperTick = isToken0Base ? priceToTick(upperPrice, isToken0Base, token0.decimal, token1.decimal, 'up') : priceToTick(lowerPrice, isToken0Base, token0.decimal, token1.decimal, 'up')
  const lowerTick =  Math.floor(_lowerTick / poolInfo.tickSpacing) * poolInfo.tickSpacing
  const upperTick =  Math.ceil(_upperTick / poolInfo.tickSpacing) * poolInfo.tickSpacing
  logger.debug(`[util.calPoolRange] lowerTick=${lowerTick} tick=${poolInfo.tick} upperTick=${upperTick}`)
  const absLower = Math.abs(_lowerTick - poolInfo.tick)
  const absUpper = Math.abs(upperTick - poolInfo.tick)
  logger.debug('[util.calPoolRange] absLower=', absLower)
  logger.debug('[util.calPoolRange] absUpper=', absUpper)
  const quarterRange = Math.ceil(Math.max(absLower, absUpper) / poolInfo.tickSpacing)
  logger.debug('[util.calPoolRange] quarterRange=', quarterRange)
  const max = Math.min(MAX_TICK, upperTick + quarterRange * poolInfo.tickSpacing)
  const min = Math.max(MIN_TICK, lowerTick - quarterRange * poolInfo.tickSpacing)
  return {min: min, max: max, currentTick: poolInfo.tick, lower: lowerTick, upper: upperTick}
}

export const calcPoolPriceFromTick = (tick: number, token0 : TokenType, token1: TokenType) => {
  const isToken0Base = token0.address.toLowerCase() < token1.address.toLowerCase()
  const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0.decimal - token1.decimal) : new Decimal(10).pow(token1.decimal - token0.decimal)
  const priceRatio = new Decimal(1.0001).pow(tick)
  const adjustedPrice = isToken0Base ? priceRatio.mul(decimalsAdjustment) : new Decimal(1).dividedBy(priceRatio.mul(decimalsAdjustment))
  const roundedPriceFromTick = adjustedPrice.toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP);
  return roundedPriceFromTick.toString()
}

export const isDataStale = (oldPoolInfo: PoolInfo, newPoolInfo: PoolInfo, slipage: number) => {
  logger.debug('[util.isDataStale] oldPoolInfo=', oldPoolInfo)
  logger.debug('[util.isDataStale] newPoolInfo=', newPoolInfo)
  if (oldPoolInfo.tick !== newPoolInfo.tick) return true
  const price_old = calOriginPriceBySqrtPriceX96(oldPoolInfo.sqrtPriceX96)
  const price_new = calOriginPriceBySqrtPriceX96(newPoolInfo.sqrtPriceX96)
  const diff = price_new.minus(price_old).abs().dividedBy(price_old)
  const isStale = diff.greaterThan(slipage)
  logger.debug('[util.isDataStale] isStale=', isStale)
  return isStale
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  // If date is in the future, return "just now"
  if (diffInSeconds < 0) {
    return 'just now';
  }
  
  // Define time units
  const intervals = {
    year: 31536000, // 365 * 24 * 60 * 60
    month: 2592000,  // 30 * 24 * 60 * 60
    week: 604800,   // 7 * 24 * 60 * 60
    day: 86400,     // 24 * 60 * 60
    hour: 3600,     // 60 * 60
    minute: 60,
    second: 1
  };
  
  // Calculate relative time
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
}


