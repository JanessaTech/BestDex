import { 
    usePublicClient
  } from 'wagmi'
import {calcPoolAddress} from '@/lib/tools/pool'

const usePoolHook = (chainId: number) => {
    const publicClient = usePublicClient({chainId})

    const getPoolAddress = async (tokenA:`0x${string}`, tokenB: `0x${string}`, 
        feeAmount: number): Promise<`0x${string}`> => {
            const poolAddress = await calcPoolAddress(tokenA, tokenB, feeAmount, chainId, publicClient)
            return poolAddress
    }

    return {getPoolAddress}
}

export default usePoolHook