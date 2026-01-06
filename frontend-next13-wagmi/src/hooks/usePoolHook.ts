import { calcPoolAddress } from '@/common/utils'
import { ethers} from 'ethers'
import { 
    usePublicClient
  } from 'wagmi'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { PoolInfo } from '@/lib/client/types'
import logger from '@/common/Logger'

const usePoolHook = (chainId: number) => {
    const publicClient = usePublicClient({chainId})

    const getPoolAddress = async (tokenA:`0x${string}`, tokenB: `0x${string}`, 
        feeAmount: number): Promise<`0x${string}`> => {
            const poolAddress = await calcPoolAddress(tokenA, tokenB, feeAmount, chainId, publicClient)
            return poolAddress
    }

    const getLatestPoolInfoByRPC = async (poolAddress: `0x${string}`): Promise<PoolInfo> => {
        try {
            if (!publicClient) throw new Error('publicClient is null')
            const data = await publicClient.multicall({
                contracts: [
                    {
                        address: poolAddress,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'token0'
                    },
                    {
                        address: poolAddress,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'token1'
                    },
                    {
                        address: poolAddress,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'fee'
                    },
                    {
                        address: poolAddress,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'tickSpacing'
                    },
                    {
                        address: poolAddress,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'slot0'
                    },
                    {
                        address: poolAddress,
                        abi: IUniswapV3PoolABI.abi,
                        functionName: 'liquidity'
                    }
                ]
            })
            //logger.debug('poolAddress', poolAddress, 'data=', data)
            if (!(data[0].result && data[0].status === 'success')
                || !(data[1].result && data[1].status === 'success')
                || !(data[2].result && data[2].status === 'success')
                || !(data[3].result && data[3].status === 'success')
                || !(data[4].result && data[4].status === 'success')
                || !(data[5].status === 'success')
                ) {
                    throw new Error('It failed to get full pool data')
                }
            const slot0 = data[4].result as [ethers.BigNumber, number, any, any, any, any, any]
            return {
                    token0: data[0].result,
                    token1: data[1].result,
                    fee: data[2].result,
                    tickSpacing: data[3].result,
                    //slot0: slot0.map((e) => e.toString()),
                    sqrtPriceX96 : slot0[0].toString(),
                    tick: slot0[1],
                    liquidity: (data[5].result as any).toString(),
                    timeStamp: Date.now()
                    } as PoolInfo
        } catch (error) {
            logger.error('It failed to call IUniswapV3Pool, due to:', error)
            throw error
        }
    }

    return {getPoolAddress, getLatestPoolInfoByRPC}
}

export default usePoolHook