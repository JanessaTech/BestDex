'use client'

import usePriceHook, { TokenPriceInUSDType } from "@/hooks/usePriceHook"
import useTokenBalanceHook from "@/hooks/useTokenBalanceHook";
import useURLHook from "@/hooks/useURLHook"
import { createContext, useContext } from "react"

export interface IContextUtil {
    getCurrentPath: () => string;
    tokenPrices: TokenPriceInUSDType;
    getTokenBalance: (
            tokenAddress: `0x${string}`| undefined, 
            userAddress: `0x${string}`, 
            options: { decimals?: number }) => Promise<string>
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const {getCurrentPath} = useURLHook()
    const {tokenPrices} = usePriceHook()
    const {getTokenBalance} = useTokenBalanceHook() 
    return (
        <ContextUtil.Provider value={{getCurrentPath, tokenPrices, getTokenBalance}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider