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
import { ChainId } from '@uniswap/sdk-core'
import { LocalChainIds } from "@/common/types";

export interface IContextUtil {
    isWSConnected: boolean;  // indicate if the websocket is connected
    getTokenPrice: (chainId: (ChainId | LocalChainIds), address: `0x${string}`) => string | undefined
    getTokenBalance: (
            tokenAddress: `0x${string}`| undefined, 
            userAddress: `0x${string}`, 
            options: { decimals?: number }) => Promise<string>;
    getPoolAddress: (tokenA:`0x${string}`, tokenB: `0x${string}`, feeAmount: number) => Promise<`0x${string}`>;
    getLatestPoolInfoByRPC: (poolAddress: `0x${string}`) => Promise<PoolInfo> //get the latest poolInfo from rpc
    getLatestPoolInfoByWS: (chainId: number, poolAddress: string) => PoolInfo | undefined   //get the latest poolInfo by websocket
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const chainId = useChainId()
    const {getTokenPrice} = usePriceHook()
    const {getTokenBalance} = useTokenBalanceHook(chainId) 
    const {getPoolAddress, getLatestPoolInfoByRPC} = usePoolHook(chainId)


    const callback = (fullData: WebSocketMessage) => {
        //TBD
    }

    const config: WebSocketConfig = {
        url: 'ws://localhost:3100', 
        maxReconnectAttempts: 5, 
        reconnectInterval: 10}
    
    const {connect, disconnect, subscribe, unsubscribe, getLatestPoolInfo: getLatestPoolInfoByWS, isConnected: isWSConnected} = useWebSocket(config)

    useEffect(() => {
        if (!isWSConnected) {
            connect()
        } else {
            const subscriptionId = subscribe(CHANNELS.POOLINFO, callback)
            logger.info(`The new subscription id: ${subscriptionId}`)
        }
        
        return () => {
            if (isWSConnected) {
                disconnect()
            }
        }
    }, [isWSConnected])

    return (
        <ContextUtil.Provider value={{isWSConnected,
                                      getTokenPrice,
                                      getTokenBalance, 
                                      getPoolAddress, 
                                      getLatestPoolInfoByRPC,
                                      getLatestPoolInfoByWS}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider