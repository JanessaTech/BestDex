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

const usePoolInfoHook = () => {
    const publicClient = usePublicClient()

    const getPoolInfo = async (token0 : TokenType, token1: TokenType, feeAmount: number): Promise<PoolInfo> => {
        try {
            if (!publicClient) throw new Error('publicClient is null')
            const feeAmount_enum = Object.values(FeeAmount).includes(feeAmount) ? feeAmount as FeeAmount : FeeAmount.MEDIUM
            console.log('feeAmount_enum=', feeAmount_enum)
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
            console.log(data)
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
    return {getPoolInfo}
}

export default usePoolInfoHook