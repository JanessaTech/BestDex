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
import {parseAbi} from 'viem'

export interface PoolInfo {
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    sqrtPriceX96: ethers.BigNumber
    liquidity: ethers.BigNumber
    tick: number
}
const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const usePoolInfoHook = () => {
    const publicClient = usePublicClient()

    const getPoolInfo = async (token0 : Token, token1: Token, feeAmount: FeeAmount) => {
        try {
            if (!publicClient) throw new Error('publicClient is null')
                const currentPoolAddress = computePoolAddress({
                    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
                    tokenA: token0,
                    tokenB: token1,
                    fee: feeAmount,
                })
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
                            functionName: 'liquidity'
                        },
                        {
                            address: currentPoolAddress as `0x${string}`,
                            abi: IUniswapV3PoolABI.abi,
                            functionName: 'slot0'
                        },
                    ]
                })
        } catch (error) {
            console.log('It failed to call IUniswapV3Pool, due to:', error)
            throw new Error('Failed to get pool info ')
        }

    }
    return {getPoolInfo}
}

export default usePoolInfoHook