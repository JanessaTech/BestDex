import { 
    usePublicClient
  } from 'wagmi'
import { TokenType } from '@/lib/types'
import { PoolInfo, calcPoolAddress, fetchPoolInfo } from '@/lib/tools/pool'

const usePoolHook = (chainId: number) => {
    const publicClient = usePublicClient({chainId})

    const getPoolInfo = async (token0 : TokenType, token1: TokenType, feeAmount: number): Promise<PoolInfo> => {
        const poolAddress = await calcPoolAddress(token0.address, token1.address, feeAmount, chainId, publicClient)
        const res = await fetchPoolInfo(poolAddress, publicClient)
        return res
    }

    const getPoolAddress = async (tokenA:`0x${string}`, tokenB: `0x${string}`, 
        feeAmount: number): Promise<`0x${string}`> => {
            const poolAddress = await calcPoolAddress(tokenA, tokenB, feeAmount, chainId, publicClient)
            return poolAddress
    }

    return {getPoolInfo, getPoolAddress}
}

export default usePoolHook