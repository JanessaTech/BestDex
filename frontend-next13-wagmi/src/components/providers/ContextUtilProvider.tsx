'use client'

import usePoolInfoHook, { PoolInfo } from "@/hooks/usePoolInfoHook";
import usePriceHook, { TokenPriceInUSDType } from "@/hooks/usePriceHook"
import useTokenBalanceHook from "@/hooks/useTokenBalanceHook";
import useURLHook from "@/hooks/useURLHook"
import { createContext, useContext } from "react"
import {Token} from '@uniswap/sdk-core'

export interface IContextUtil {
    getCurrentPath: () => string;
    tokenPrices: TokenPriceInUSDType;
    getTokenBalance: (
            tokenAddress: `0x${string}`| undefined, 
            userAddress: `0x${string}`, 
            options: { decimals?: number }) => Promise<string>;
    getPoolInfo: (token0 : Token, token1: Token, feeAmount: number) => Promise<PoolInfo>
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const {getCurrentPath} = useURLHook()
    const {tokenPrices} = usePriceHook()
    const {getTokenBalance} = useTokenBalanceHook() 
    const {getPoolInfo} = usePoolInfoHook()
    return (
        <ContextUtil.Provider value={{getCurrentPath, tokenPrices, getTokenBalance, getPoolInfo}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider