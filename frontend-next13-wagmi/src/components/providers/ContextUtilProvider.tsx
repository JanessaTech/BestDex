'use client'

import usePriceHook, { TokenPriceInUSDType } from "@/hooks/usePriceHook"
import useTokenBalanceHook from "@/hooks/useTokenBalanceHook";
import useURLHook from "@/hooks/useURLHook"
import { createContext, useContext } from "react"
import { TokenType } from "@/lib/types";
import usePoolHook from "@/hooks/usePoolHook";
import useWebSocketHook from "@/hooks/useWebSocketHook";
import { PoolInfo } from "@/lib/tools/pool";

export interface IContextUtil {
    getCurrentPath: () => string;
    tokenPrices: TokenPriceInUSDType;
    getTokenBalance: (
            tokenAddress: `0x${string}`| undefined, 
            userAddress: `0x${string}`, 
            options: { decimals?: number }) => Promise<string>;
    getPoolInfo: (token0 : TokenType, token1: TokenType, feeAmount: number) => Promise<PoolInfo>;
    getLatestResult: () => any
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const {getCurrentPath} = useURLHook()
    const {tokenPrices} = usePriceHook()
    const {getTokenBalance} = useTokenBalanceHook() 
    const {getPoolInfo} = usePoolHook()
    const {getLatestResult} = useWebSocketHook()

    return (
        <ContextUtil.Provider value={{getCurrentPath, 
                                      tokenPrices, 
                                      getTokenBalance, 
                                      getPoolInfo,
                                      getLatestResult}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider