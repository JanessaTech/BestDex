import { Button } from "@/components/ui/button"
import type { TokenType } from "@/lib/types"
import { useAccount} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ethers, BigNumber} from 'ethers'
import { ChainId, Token} from '@uniswap/sdk-core'
import { computePoolAddress, FeeAmount} from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { POOL_FACTORY_CONTRACT_ADDRESS, QUOTER_CONTRACT_ADDRESS, READABLE_FORM_LEN } from "@/config/constants"

type QuotesProps = {
    tokenFrom: TokenType,
    tokenTo: TokenType,
    swapAmount: number
}

function fromReadableAmount(
    amount: number,
    decimals: number
  ): BigNumber {
    return ethers.utils.parseUnits(amount.toString(), decimals)
  }

function toReadableAmount(rawAmount: number, decimals: number): string {
return ethers.utils
    .formatUnits(rawAmount, decimals)
    .slice(0, READABLE_FORM_LEN)
}

const Quotes:React.FC<QuotesProps> = ({tokenFrom, tokenTo, swapAmount}) => {
    const { isConnected, connector} = useAccount()
    const { openConnectModal } = useConnectModal()
    const tokenIn = new Token(ChainId.MAINNET, tokenFrom.address, tokenFrom.decimal, tokenFrom.symbol, tokenFrom.name)
    const tokenOut = new Token(ChainId.MAINNET, tokenTo.address, tokenTo.decimal, tokenTo.symbol, tokenTo.name)
    const [loading, setLoading] = useState<boolean>(false)
    const [quote, setQuote] = useState('')

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const res = await getQuote()
                if (!res) throw new Error('failed to get quote')
                setQuote(res)
            } catch (e) {
                toast.error('Failed to get quote. Please try again')
            }
            setLoading(false)
        })()
    }, [])

    async function getQuote(): Promise<string | undefined> {
        try {
            const provider = await connector?.getProvider()
            if (!provider) throw new Error('failed to get provider')
            const web3provider = new ethers.providers.Web3Provider(provider)
            const quoterContract = new ethers.Contract(QUOTER_CONTRACT_ADDRESS, Quoter.abi, web3provider)

            const poolConstants = await getPoolConstants(web3provider)

            const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
                poolConstants.token0,
                poolConstants.token1,
                poolConstants.fee,
                fromReadableAmount(swapAmount, tokenIn.decimals).toString(),
                0
              )
              return toReadableAmount(quotedAmountOut, tokenOut.decimals)

        } catch (e) {
            console.log('failed to get quote due to:', e)
            throw e
        }
    }

      async function getPoolConstants(web3provider: ethers.providers.Web3Provider): Promise<{token0: string, token1: string, fee: number}> {
        const currentPoolAddress = computePoolAddress({
            factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA: new Token(ChainId.MAINNET, tokenFrom.address, tokenFrom.decimal, tokenFrom.symbol, tokenFrom.name),
            tokenB: new Token(ChainId.MAINNET, tokenTo.address, tokenTo.decimal, tokenTo.symbol, tokenTo.name),
            fee: FeeAmount.MEDIUM,
          })
  
          const poolContract = new ethers.Contract(
            currentPoolAddress,
            IUniswapV3PoolABI.abi,
            web3provider
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

    const handleSwap = () => {

    }

    return (
        <div>
            <div className='flex justify-center'>
            <Button className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600 text-white">{loading ? 'loading' : quote}</Button>
            <Button 
                className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600' 
                disabled={isConnected ? !tokenFrom || !tokenTo || !swapAmount : false}
                onClick={isConnected ? handleSwap : openConnectModal}>{isConnected ? 'Swap' :'Connect Wallet'}</Button>
            </div>
        </div>
    )
}

export default Quotes