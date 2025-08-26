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

export type PoolInfo = {
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

    const getPoolInfo = async (token0 : Token, token1: Token, feeAmount: number): Promise<PoolInfo> => {
        try {
            if (!publicClient) throw new Error('publicClient is null')
            const feeAmount_enum = Object.values(FeeAmount).includes(feeAmount) ? feeAmount as FeeAmount : FeeAmount.MEDIUM
            console.log('feeAmount_enum=', feeAmount_enum)
            const currentPoolAddress = computePoolAddress({
                factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
                tokenA: token0,
                tokenB: token1,
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
                        functionName: 'sqrtPriceX96'
                    },
                    {
                        address: currentPoolAddress as `0x${string}`,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'liquidity'
                    },
                    {
                        address: currentPoolAddress as `0x${string}`,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'tick'
                    },
                ]
            })

            if (!data[0].result 
                || !data[1].result
                || !data[2].result
                || !data[3].result
                || !data[4].result
                || !data[5].result
                || !data[6].result) {
                    throw new Error('It failed to get full pool data')
                }
            return {
                    token0: data[0].result,
                    token1: data[1].result,
                    fee: data[2].result,
                    tickSpacing: data[3].result,
                    sqrtPriceX96: data[4].result,
                    liquidity: data[5].result,
                    tick: data[6].result
                    } as PoolInfo
        } catch (error) {
            console.log('It failed to call IUniswapV3Pool, due to:', error)
            throw new Error('Failed to get pool info ')
        }
    }
    return {getPoolInfo}
}

export default usePoolInfoHook