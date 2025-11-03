import { NextResponse } from 'next/server';
import {
    AlphaRouter,
    SwapOptionsSwapRouter02,
    SwapType,
    AlphaRouterConfig 
  } from '@uniswap/smart-order-router'
import { ethers } from 'ethers'
import { TradeType, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import type { QuotesParameterType } from '@/lib/types'
import { Decimal } from 'decimal.js'
import { fromReadableAmount } from '@/lib/utils';

async function parseDataFromRequest(request: Request) {
  const data = await request.json() as QuotesParameterType
  console.log('data', data)
  return {
    chainId: data.chainId,
    provider: new ethers.providers.JsonRpcProvider(data.rpcUrl),
    recipient: data.recipient,
    amountIn: data.amountIn,
    slippageTolerance: new Percent(data.slippage, 10_000),
    deadline: Math.floor(Date.now() / 1000 + data.deadline),
    tokenIn : new Token(data.chainId, data.tokenIn.address, data.tokenIn.decimal, data.tokenIn.symbol, data.tokenIn.name),
    tokenOut : new Token(data.chainId, data.tokenOut.address, data.tokenOut.decimal, data.tokenOut.symbol, data.tokenOut.name)
  }
}

export async function POST(request: Request) {
  console.log('POST - get quotes')
    try {
        const params = await parseDataFromRequest(request)
        // const routerConfig: AlphaRouterConfig = {
        //   maxSwapsPerPath: 3,
        //   maxSplits: 2,
        //   distributionPercent: 10, 
        //   v2PoolSelection: {
        //     topN: 2, // 只选择前2个V2池
        //     topNDirectSwaps: 1,
        //     topNTokenInOut: 1,
        //     topNSecondHop: 1,
        //     topNWithEachBaseToken: 1,
        //     topNWithBaseToken: 1,},
        //   v3PoolSelection: {
        //     topN: 5, // 只选择前5个V3池
        //     topNDirectSwaps: 1,
        //     topNTokenInOut: 1,
        //     topNSecondHop: 1,
        //     topNWithEachBaseToken: 1,
        //     topNWithBaseToken: 1,
        //   },
        //   v4PoolSelection: {
        //     topN: 2, // 只选择前2个V4池
        //     topNDirectSwaps: 1,
        //     topNTokenInOut: 1,
        //     topNSecondHop: 1,
        //     topNWithEachBaseToken: 1,
        //     topNWithBaseToken: 1,
        //   },
        //   minSplits: 1,
        //   forceCrossProtocol: false
        // }
        const router = new AlphaRouter({
          chainId: params.chainId,
          provider: params.provider,
          //...routerConfig
      })
  
      const options: SwapOptionsSwapRouter02 = {
          recipient: params.recipient,
          slippageTolerance: params.slippageTolerance,
          deadline: params.deadline,
          type: SwapType.SWAP_ROUTER_02,
      }
        
      let route = await router.route(
          CurrencyAmount.fromRawAmount(
              params.tokenIn,
            fromReadableAmount(
              params.amountIn,
              params.tokenIn.decimals
            ).toString()
          ),
          params.tokenOut,
          TradeType.EXACT_INPUT,
          options
        )
      if (!route) return NextResponse.json({ success: false, message: 'failed to get route'})
      const cost  = new Decimal(route?.estimatedGasUsed.toString()).times(new Decimal((await params.provider.getGasPrice()).toString())).div('1000000000000000000').toDecimalPlaces(18, Decimal.ROUND_HALF_UP).toString()
      return NextResponse.json({ 
      success: true, 
      quote: route.quote.toExact(), 
      estimatedGasUsed: cost,
      estimatedGasUsedUSD: route.estimatedGasUsedUSD.toFixed(2),
      calldata: route.methodParameters?.calldata
      })
    } catch(e) {
        console.log('failed to get quotes due to:', e)
        return NextResponse.json({ success: false})
    }
}