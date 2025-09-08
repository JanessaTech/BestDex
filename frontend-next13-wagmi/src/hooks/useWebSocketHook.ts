import { useState } from "react"
import BrowserUniswapV3PoolListener from "./listeners/BrowserUniswapV3PoolListener"
import { chainUrls } from "@/config/wagmi"
import { PoolInfo, calcPoolAddress } from "@/lib/tools/pool"
import { 
    usePublicClient
  } from 'wagmi'
import { TokenType } from "@/lib/types"
import LocalUniswapV3PoolListener from "./listeners/LocalUniswapV3PoolListener"

const useWebSocketHook = (chainId: number) => {
    const [listenersMap, setListenersMap] = useState<Map<number, Map<`0x${string}`, BrowserUniswapV3PoolListener | LocalUniswapV3PoolListener>>>(new Map([]))
    const publicClient = usePublicClient({chainId})

    const getLatestPoolInfo = (poolAddress: `0x${string}`): PoolInfo | undefined => {
        console.log(`get latest pool info from poolAddress=${poolAddress} and chainId=${chainId}`)
        const listener = listenersMap.get(chainId)?.get(poolAddress)
        const poolInfo = listener?.getLatestPooInfo()
        return poolInfo
    }

    const addWebSocketListener = async (token0 : TokenType, token1: TokenType, feeAmount: number) => {
        let poolAddress = undefined
        try {
            poolAddress = await calcPoolAddress(token0.address, token1.address, feeAmount, chainId, publicClient)
            console.log(`poolAddress=${poolAddress}, token0=${token0.symbol}, token1=${token1.symbol}, chainId=${chainId} ,feeAmount=${feeAmount}`)
        } catch (error) {
            console.log('poolAddress is invalid due to:', error)
            throw new Error('Invalid pool address')
        }
        let found = Object.entries(chainUrls).find(([key, value]) => key === `${chainId}`)
        if (!found) {
            console.log(`No found wss url for ${chainId}`)
            throw new Error(`No found wss url for ${chainId}`)
        }
        const wssURL = found[1]
        console.log(`poolAddress =${poolAddress}, wssURL=${wssURL}`)
        if (!publicClient) throw new Error('publicClient is null')
        if (!listenersMap.get(chainId)?.get(poolAddress)) { // add listener only when no listener
            let listener!: BrowserUniswapV3PoolListener | LocalUniswapV3PoolListener
            if (chainId === 31337) { //for test
                listener = new LocalUniswapV3PoolListener(poolAddress, wssURL, publicClient)
            } else {
                listener = new BrowserUniswapV3PoolListener(poolAddress, wssURL, publicClient)
            }
            const newListenersMap = new Map(listenersMap)
            if (!newListenersMap.has(chainId)) {
                newListenersMap.set(chainId, new Map())
            }
            newListenersMap.get(chainId)?.set(poolAddress, listener)
            console.log('A new listener is added!')
            setListenersMap(newListenersMap)
        } else {
            console.log('A new listener was already added!')
        }
    }

    return {addWebSocketListener, getLatestPoolInfo}
}

export default useWebSocketHook