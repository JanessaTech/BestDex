'use client'

import usePriceHook, { TokenPriceInUSDType } from "@/hooks/usePriceHook"
import useTokenBalanceHook from "@/hooks/useTokenBalanceHook";
import useURLHook from "@/hooks/useURLHook"
import { createContext, useContext } from "react"
import { TokenType } from "@/lib/types";
import usePoolHook from "@/hooks/usePoolHook";
import useWebSocketHook from "@/hooks/useWebSocketHook";
import { PoolInfo } from "@/lib/tools/pool";
import { useChainId} from 'wagmi'

export interface IContextUtil {
    getCurrentPath: () => string;
    tokenPrices: TokenPriceInUSDType;
    getTokenBalance: (
            tokenAddress: `0x${string}`| undefined, 
            userAddress: `0x${string}`, 
            options: { decimals?: number }) => Promise<string>;
    getPoolInfo: (token0 : TokenType, token1: TokenType, feeAmount: number) => Promise<PoolInfo>;
    getPoolAddress: (tokenA:`0x${string}`, tokenB: `0x${string}`, feeAmount: number) => Promise<`0x${string}`>;
    getLatestPoolInfo: (poolAddress: `0x${string}`) => PoolInfo | undefined;
    addWebSocketListener: (token0 : TokenType, token1: TokenType, feeAmount: number) => Promise<void>
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const chainId = useChainId()
    const {getCurrentPath} = useURLHook()
    const {tokenPrices} = usePriceHook()
    const {getTokenBalance} = useTokenBalanceHook(chainId) 
    const {getPoolInfo, getPoolAddress} = usePoolHook(chainId)
    const {getLatestPoolInfo, addWebSocketListener} = useWebSocketHook(chainId)

    return (
        <ContextUtil.Provider value={{getCurrentPath, 
                                      tokenPrices, 
                                      getTokenBalance, 
                                      getPoolInfo,getPoolAddress,
                                      getLatestPoolInfo, addWebSocketListener}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider