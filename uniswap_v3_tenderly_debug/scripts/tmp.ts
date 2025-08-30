import {CurrencyAmount, Token, ChainId, Percent } from '@uniswap/sdk-core'
import { 
    FeeAmount , 
    nearestUsableTick
    } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
import { Decimal } from 'decimal.js';

const USDC_TOKEN = new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
)
const DAI_TOKEN = new Token(
    ChainId.MAINNET,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18,
    'DAI',
    'Dai Stablecoin'
  )

const tokens =  {
    token0: USDC_TOKEN,
    token0Amount: 1000,
    token1: DAI_TOKEN,
    token1Amount: 1000,
    poolFee: FeeAmount.LOW,
}

function fromReadableAmount(amount: number, decimals: number): JSBI {
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
function test_CurrencyAmount() {
    const token0Amount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(
        tokens.token0,
        fromReadableAmount(
          tokens.token0Amount,
          tokens.token0.decimals
        ))
    const amount0 =  token0Amount.quotient
    console.log('amount0 =', amount0)
    
}
function test_nearestUsableTick() {
    const res = nearestUsableTick(7, 5)
    console.log('nearestUsableTick =', res)
}

function FeeAmount_test() {
    enum FeeAmount {
      LOWEST = 100,
      LOW_200 = 200,
      LOW_300 = 300,
      LOW_400 = 400,
      LOW = 500,
      MEDIUM = 3000,
      HIGH = 10000
  }
  const value = 500
  const res = Object.values(FeeAmount).includes(value)
    ? value as FeeAmount
    : FeeAmount.MEDIUM
  console.log(res)
}

function sqrtPriceX96 (sqrtPriceX96Str:string, isToken0Base: boolean, token0Decimals: number, token1Decimals: number) {
  const sqrtPriceX96 = new Decimal(sqrtPriceX96Str)
  const TWO_96 = new Decimal(2).pow(96);

  // price = (sqrtPriceX96 / 2^96)^2
  const sqrtRatio = sqrtPriceX96.dividedBy(TWO_96);
  const ratio = sqrtRatio.pow(2);
  
  // adjust
  const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0Decimals - token1Decimals) :  new Decimal(10).pow(token1Decimals - token0Decimals)
  const adjustedRatio = ratio.times(decimalsAdjustment);
  // console.log(adjustedRatio.toString())
  
  // result
  const res  = isToken0Base ? adjustedRatio : new Decimal(1).dividedBy(adjustedRatio)
  
  return res.toDecimalPlaces(token1Decimals, Decimal.ROUND_HALF_UP)
}

function tickToPrice(tick: number, isToken0Base: boolean, token0Decimals: number, token1Decimals: number) {
  const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0Decimals - token1Decimals) : new Decimal(10).pow(token1Decimals - token0Decimals)
  const priceRatio = new Decimal(1.0001).pow(tick)
  const adjustedPrice = isToken0Base ? priceRatio.mul(decimalsAdjustment) : new Decimal(1).dividedBy(priceRatio.mul(decimalsAdjustment))
  const rounded = adjustedPrice.toDecimalPlaces(token1Decimals, Decimal.ROUND_HALF_UP);
  console.log('rounded=', rounded)
}

function priceToTick(price: Decimal, 
                     isToken0Base: boolean, 
                     token0Decimals: number, 
                     token1Decimals: number, 
                     roundDirection: 'nearest' | 'up' | 'down') {
  // const token0Decimals: number = 6
  // const token1Decimals: number = 18
  const TICK_BASE = new Decimal(1.0001);
  const MIN_TICK = -887272;
  const MAX_TICK = 887272;
  const priceDecimal = isToken0Base ? new Decimal(price) : new Decimal(1).dividedBy(new Decimal(price));
  const decimalsAdjustment = isToken0Base ? new Decimal(10).pow(token0Decimals - token1Decimals) : new Decimal(10).pow(token1Decimals - token0Decimals) 
  const adjustedPrice = priceDecimal.div(decimalsAdjustment);
  const tick = adjustedPrice.log().div(TICK_BASE.log());
  //const roundDirection = 'nearest' as ('nearest' | 'up' | 'down')
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

  const resTick = Math.max(MIN_TICK, Math.min(MAX_TICK, roundedTick));
  console.log('resTick=', resTick)
  return resTick
}

function rangeSelect(sqrtPriceX96Str: string, 
                      isToken0Base: boolean, 
                      token0Decimals: number, 
                      token1Decimals: number) {
  const MIN_TICK = -887272
  const MAX_TICK = 887272
  const tickSpacing = 60
  let rangePertage = 0.1 
  //const sqrtPriceX96Str: string = '1300326548979566885653193588871961'
  const tick =  194125
  // const token0Decimals: number = 18
  // const token1Decimals: number = 6
  // const isToken0Base: boolean = false
  const currentPrice = sqrtPriceX96(sqrtPriceX96Str, isToken0Base, token0Decimals, token1Decimals)
  console.log('currentPrice=', currentPrice.toString())
  const lowerPrice = currentPrice.mul(1 - rangePertage)
  const upperPrice = currentPrice.mul(1 + rangePertage)
  console.log('lowerPrice=', lowerPrice)
  console.log('upperPrice=', upperPrice)
  const _lowerTick = isToken0Base ? priceToTick(lowerPrice, isToken0Base, token0Decimals, token1Decimals, 'down') : priceToTick(upperPrice, isToken0Base, token0Decimals, token1Decimals, 'down')
  const _upperTick = isToken0Base ? priceToTick(upperPrice, isToken0Base, token0Decimals, token1Decimals, 'up') : priceToTick(lowerPrice, isToken0Base, token0Decimals, token1Decimals, 'up')
  const lowerTick =  Math.floor(_lowerTick / tickSpacing) * tickSpacing
  const upperTick =  Math.ceil(_upperTick / tickSpacing) * tickSpacing;
  console.log(`lowerTick=${lowerTick} tick=${tick} upperTick=${upperTick}`)
  const absLower = Math.abs(_lowerTick - tick)
  const absUpper = Math.abs(upperTick - tick)
  console.log('absLower=', absLower)
  console.log('absUpper=', absUpper)
  const quarterRange = Math.ceil(Math.max(absLower, absUpper) / tickSpacing)
  console.log('quarterRange=', quarterRange)
  const max = Math.min(MAX_TICK, upperTick + quarterRange * tickSpacing)
  const min = Math.max(MIN_TICK, lowerTick - quarterRange * tickSpacing)
  console.log('max=', max)
  console.log('min=', min)
}


//test_CurrencyAmount()
//test_nearestUsableTick()
//FeeAmount_test()

const sqrtPriceX96Str = '1300326548979566885653193588871961'
const token0Decimals: number = 6
const token1Decimals: number = 18
const isToken0Base: boolean = true
const tick = 194125
const tickSpacing = 60
const priceToken0 = new Decimal('0.000269367807829062')
const priceToken1 = new Decimal('3712.396103')

// const res = sqrtPriceX96(sqrtPriceX96Str, isToken0Base, token0Decimals, token1Decimals)
// console.log(res.toString())

tickToPrice(tick, isToken0Base, token0Decimals, token1Decimals)


//priceToTick(priceToken0, isToken0Base, token0Decimals, token1Decimals, 'nearest')

//rangeSelect(sqrtPriceX96Str, isToken0Base, token0Decimals, token1Decimals)

//npx hardhat run scripts\tmp.ts
