import { 
    usePublicClient
  } from 'wagmi'
import { formatUnits } from 'viem'
import { ERC20_ABI } from '@/config/constants'

const useTokenBalanceHook = () => {
    const publicClient = usePublicClient()

    const getTokenBalance = async (
        tokenAddress: `0x${string}`| undefined, 
        userAddress: `0x${string}`,
        options: { decimals?: number } = {}
        ):Promise<string> => {
        try {
            const decimals = options.decimals ? options.decimals : 18
            if (!publicClient) throw new Error('publicClient is null')
            if (!tokenAddress) { // for native token
                const balance = await publicClient.getBalance({
                    address: userAddress
                  })
                
                return formatUnits(balance, decimals)
            }
            const balance = await publicClient.readContract({
                abi: ERC20_ABI,
                address: tokenAddress,
                functionName: 'balanceOf',
                args: [userAddress]
            })
            return formatUnits(balance , decimals)
        } catch (err) {
            console.log('[useTokenBalanceHook] Failed to get balance due to:', err)
            throw new Error('Failed to get balance')
        }
    }
    return {getTokenBalance}
}

export default useTokenBalanceHook