import { PoolInfo } from "../types/TypesInInfra"
import { ethers} from 'ethers'
import { PublicClient } from 'viem'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import logger from '../../helpers/logger';
import { UNISWAP_V3_FACTORY_ABI, UNISWAP_V3_FACTORY_ADDRESSES, ZERO_ADDRESS } from "../../helpers/common/constants";

export const fetchPoolInfo = async (poolAddress: `0x${string}`, publicClient: PublicClient): Promise<PoolInfo> => {
    try {
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
        logger.debug('poolAddress', poolAddress, 'data=', data)
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
                slot0: slot0.map((e) => e.toString()),
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

export const calcPoolAddress = async (tokenA:`0x${string}`, tokenB: `0x${string}`, 
    feeAmount: number, chainId: number, publicClient : PublicClient): Promise<`0x${string}`> => {
        try {
            const factoryAddress = UNISWAP_V3_FACTORY_ADDRESSES[chainId]
            if (!factoryAddress) {
                throw new Error(`No uniswap v3 factory address is found for chainId ${chainId}`)
            }
            const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() 
                    ? [tokenA, tokenB]
                    : [tokenB, tokenA]
            const poolAddress = await publicClient.readContract({
                abi: UNISWAP_V3_FACTORY_ABI,
                address: factoryAddress,
                functionName: 'getPool',
                args: [token0, token1, feeAmount]
            })
            if (isZeroAddress(poolAddress)) {
                throw new Error(`poolAddress calculated from tokenA ${tokenA}, tokenB ${tokenB}, feeAmount ${feeAmount}, chainId ${chainId} is zero`)
            }
            return poolAddress
        } catch (error)  {
            logger.error('Invalid pool address due to:', error)
            throw error
        }
    }

export function isZeroAddress(address: `0x${string}`) {
    return address.toLowerCase() === ZERO_ADDRESS.toLowerCase();
}