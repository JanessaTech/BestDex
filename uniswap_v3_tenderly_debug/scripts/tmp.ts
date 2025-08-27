import {CurrencyAmount, Token, ChainId, Percent } from '@uniswap/sdk-core'
import { 
    FeeAmount , 
    nearestUsableTick
    } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'

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

function test() {
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

//test_CurrencyAmount()
//test_nearestUsableTick()
test()


//npx hardhat run scripts\tmp.ts
