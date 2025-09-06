import { 
    usePublicClient
  } from 'wagmi'
import { TokenType } from '@/lib/types'
import { PoolInfo, fetchPoolInfo } from '@/lib/tools/pool'

const usePoolHook = (chainId: number) => {
    const publicClient = usePublicClient({chainId})

    const getPoolInfo = async (token0 : TokenType, token1: TokenType, feeAmount: number): Promise<PoolInfo> => {
        const res = await fetchPoolInfo( token0, token1, feeAmount, publicClient)
        return res
    }

    return {getPoolInfo}
}

export default usePoolHook