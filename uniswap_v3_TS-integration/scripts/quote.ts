import { ethers, BigNumber } from 'ethers'
import { ChainId, Token} from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress } from '@uniswap/v3-sdk'


export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
export const WETH_TOKEN = new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
)

export const USDC_TOKEN = new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
)

const tokens =  {
    in: WETH_TOKEN,
    amountIn: 1,
    out: USDC_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  }

  const READABLE_FORM_LEN = 4

  export function fromReadableAmount(
    amount: number,
    decimals: number
  ): BigNumber {
    return ethers.utils.parseUnits(amount.toString(), decimals)
  }

// function fromReadableAmount(amount: number, decimals: number): JSBI {
//   const extraDigits = Math.pow(10, countDecimals(amount))
//   const adjustedAmount = amount * extraDigits
//   return JSBI.divide(
//     JSBI.multiply(
//       JSBI.BigInt(adjustedAmount),
//       JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
//     ),
//     JSBI.BigInt(extraDigits)
//   )
// }

function countDecimals(x: number) {
  if (Math.floor(x) === x) {
      return 0
  }
  return x.toString().split('.')[1].length || 0
}
  
  export function toReadableAmount(rawAmount: number, decimals: number): string {
    return ethers.utils
      .formatUnits(rawAmount, decimals)
      .slice(0, READABLE_FORM_LEN)
  }

const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am")

export async function quote(): Promise<string> {
    const quoterContract = new ethers.Contract(
        QUOTER_CONTRACT_ADDRESS,
        Quoter.abi,
        mainnetProvider
      )

    const poolConstants = await getPoolConstants()

    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        poolConstants.token0,
        poolConstants.token1,
        poolConstants.fee,
        fromReadableAmount(
          tokens.amountIn,
          tokens.in.decimals
        ).toString(),
        0
      )
      console.log('quotedAmountOut=', quotedAmountOut)

      return toReadableAmount(quotedAmountOut, tokens.out.decimals)
}

async function getPoolConstants(): Promise<{
    token0: string
    token1: string
    fee: number
  }> {
    const currentPoolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: tokens.in,
      tokenB: tokens.out,
      fee: tokens.poolFee,
    })

    console.log('currentPoolAddress=', currentPoolAddress)
  
    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      mainnetProvider
    )
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
    ])

    return {
      token0,
      token1,
      fee,
    }
  }

  async function main() {
    const res = await quote()
    console.log(res)
  }

  main().then().catch((e) => {
    console.log(e)
  })

  //  const res = toReadableAmount(12, 2)
  //  console.log(res)