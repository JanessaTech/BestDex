import { NextResponse } from 'next/server';
import { ethers } from 'ethers'
import JSBI from 'jsbi'
import {
    AlphaRouter,
    SwapOptionsSwapRouter02,
    SwapType,
  } from '@uniswap/smart-order-router'
  import { TradeType, ChainId, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'

  export enum TransactionState {
    Failed = 'Failed',
    New = 'New',
    Rejected = 'Rejected',
    Sending = 'Sending',
    Sent = 'Sent',
  }

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

  export const USDC_TOKEN = new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
  )

    export const DAI_TOKEN = new Token(
    ChainId.MAINNET,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18,
    'DAI',
    'Dai Stablecoin'
  )

  export const WETH_TOKEN = new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  )

const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am")
export async function GET() { 

    const router = new AlphaRouter({
        chainId: 1,
        provider: mainnetProvider,
      })
    
      const options: SwapOptionsSwapRouter02 = {
        recipient: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
      }

      let route = null
    
      route = await router.route(
        CurrencyAmount.fromRawAmount(
            WETH_TOKEN,
          fromReadableAmount(
            1,
            18
          ).toString()
        ),
        USDC_TOKEN,
        TradeType.EXACT_INPUT,
        options
      )

      // // const route = await generateRoute()
    // if (!route) {
    //     return NextResponse.json({ res: TransactionState.Failed})
    // }

    console.log('The best price:', route?.quote.toExact())
    console.log('PoolIdentifiers:', route?.route.map((r) => r.poolIdentifiers))
    console.log('The path detail:', route?.route.map((r) => r.tokenPath.map((t) => t.symbol).join(' -> ')).join(', '))
    console.log('Estimated Gas:', route?.estimatedGasUsed.toString())

    // const res = await executeRoute(route)

    return NextResponse.json({ res: TransactionState.Sent})
}