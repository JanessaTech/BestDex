'use client'

import usePriceHook, { TokenPriceInUSDType } from "@/hooks/usePriceHook"
import useTokenBalanceHook from "@/hooks/useTokenBalanceHook";
import { createContext, useContext, useEffect } from "react"
import usePoolHook from "@/hooks/usePoolHook";
import { useChainId} from 'wagmi'
import useWebSocket from "@/hooks/useWebSocket";
import { WebSocketConfig, WebSocketMessage } from "@/hooks/lib/WebSocketClient";
import logger from "@/common/Logger";
import { CHANNELS } from "@/config/constants";
import { PoolInfo } from "@/lib/client/types";

export interface IContextUtil {
    tokenPrices: TokenPriceInUSDType;
    getTokenBalance: (
            tokenAddress: `0x${string}`| undefined, 
            userAddress: `0x${string}`, 
            options: { decimals?: number }) => Promise<string>;
    getPoolAddress: (tokenA:`0x${string}`, tokenB: `0x${string}`, feeAmount: number) => Promise<`0x${string}`>;
    getLatestPoolInfo: (chainId: number, poolAddress: string) => PoolInfo | undefined 
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const chainId = useChainId()
    const {tokenPrices} = usePriceHook()
    const {getTokenBalance} = useTokenBalanceHook(chainId) 
    const {getPoolAddress} = usePoolHook(chainId)


    const callback = (fullData: WebSocketMessage) => {
        //TBD
    }

    const config: WebSocketConfig = {
        url: 'ws://localhost:3100', 
        maxReconnectAttempts: 5, 
        reconnectInterval: 2}
    
    const {connect, disconnect, subscribe, unsubscribe, getLatestPoolInfo, isConnected} = useWebSocket(config)

    useEffect(() => {
        if (!isConnected) {
            connect()
        } else {
            const subscriptionId = subscribe(CHANNELS.POOLINFO, callback)
            logger.info(`The new subscription id: ${subscriptionId}`)
        }
        
        return () => {
            if (isConnected) {
                disconnect()
            }
        }
    }, [isConnected])

    return (
        <ContextUtil.Provider value={{tokenPrices, 
                                      getTokenBalance, 
                                      getPoolAddress, 
                                      getLatestPoolInfo}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider