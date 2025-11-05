import { PoolInfo } from "../types/TypesInInfra"
import { ethers} from 'ethers'
import { PublicClient } from 'viem'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

export const fetchPoolInfo = async (poolAddress: `0x${string}`, publicClient?: PublicClient): Promise<PoolInfo> => {
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
        //console.log(data)
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
                liquidity: data[5].result,
                timeStamp: Date.now()
                } as PoolInfo
    } catch (error) {
        console.log('It failed to call IUniswapV3Pool, due to:', error)
        throw error
    }
}