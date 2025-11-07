'use client'

import usePriceHook, { TokenPriceInUSDType } from "@/hooks/usePriceHook"
import useTokenBalanceHook from "@/hooks/useTokenBalanceHook";
import { createContext, useContext } from "react"
import { TokenType } from "@/lib/types";
import usePoolHook from "@/hooks/usePoolHook";
import { PoolInfo } from "@/lib/tools/pool";
import { useChainId} from 'wagmi'

export interface IContextUtil {
    tokenPrices: TokenPriceInUSDType;
    getTokenBalance: (
            tokenAddress: `0x${string}`| undefined, 
            userAddress: `0x${string}`, 
            options: { decimals?: number }) => Promise<string>;
    getPoolAddress: (tokenA:`0x${string}`, tokenB: `0x${string}`, feeAmount: number) => Promise<`0x${string}`>;
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const chainId = useChainId()
    const {tokenPrices} = usePriceHook()
    const {getTokenBalance} = useTokenBalanceHook(chainId) 
    const {getPoolAddress} = usePoolHook(chainId)

    return (
        <ContextUtil.Provider value={{tokenPrices, 
                                      getTokenBalance, 
                                      getPoolAddress}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider