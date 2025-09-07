import { useEffect, useState } from "react"
import BrowserUniswapV3PoolListener from "./listeners/BrowserUniswapV3PoolListener"
import { chainUrls } from "@/config/wagmi"
import { tokenList } from "@/lib/data"
import { FEE_TIERS } from "@/config/constants"
import { PoolInfo, calcPoolAddress } from "@/lib/tools/pool"
import { 
    usePublicClient
  } from 'wagmi'
import { TokenType } from "@/lib/types"
import LocalUniswapV3PoolListener from "./listeners/LocalUniswapV3PoolListener"

const useWebSocketHook = (chainId: number) => {
    const [listener, setListener] = useState<BrowserUniswapV3PoolListener>()
    const [listenersMap, setListenersMap] = useState<Map<number, Map<`0x${string}`, BrowserUniswapV3PoolListener | LocalUniswapV3PoolListener>>>(new Map([]))
    const publicClient = usePublicClient({chainId})

    const getLatestResult = () => {
        return listener?.getLatestResult()
    }

    const getLatestPoolInfo = (poolAddress: `0x${string}`): PoolInfo | undefined => {
        console.log(`get latest pool info from poolAddress=${poolAddress} and chainId=${chainId}`)
        const listener = listenersMap.get(chainId)?.get(poolAddress)
        const poolInfo = listener?.getLatestPooInfo()
        return poolInfo
    }

    // useEffect(() => {
    //     computePoolAddresses(chainId)
    // }, [chainId])
    /*
    const computePoolAddresses = async (chainId: number) => {
        let found = Object.entries(chainUrls).find(([key, value]) => key === `${chainId}`)
        const wssURL = found ? found[1] : undefined
        
        const filtered = tokenList.filter((l) => l.chainId === chainId)
        const tokens = filtered.length > 0 ? filtered[0].tokens : undefined
        if (tokens) {
            for (let i = 0; i < tokens.length; i++) {
                for (let j = i + 1; j < tokens.length; j++) {
                    const tokenA = tokens[i].address
                    const tokenB = tokens[j].address
                    if (chainId !== 31337) {
                        for (let feeTier of FEE_TIERS) {
                            const feeAmount = feeTier.value * 10000
                            console.log(`chainId=${chainId}, token0=${tokens[i].address}(${tokens[i].symbol}), token1=${tokens[j].address}(${tokens[j].symbol}), feeTier=${feeTier.value}`)
                            try {
                                const poolAddress = await calcPoolAddress(tokenA, tokenB, feeAmount, Number(chainId), publicClient)
                                console.log(`poolAddress=${poolAddress}, token0=${tokens[i].symbol}, token1=${tokens[j].symbol}, chainId=${chainId} ,feeAmount=${feeAmount}`)
                            } catch (error) {
                                console.log('poolAddress is invalid due to:', error)
                            }
                            
                        }
                    } else {
                        // for test
                        const feeAmount = 3000
                        console.log(`chainId=${chainId}, token0=${tokens[i].symbol}, token1=${tokens[j].symbol}, feeTier=3000`)
                        try {
                            const poolAddress = await calcPoolAddress(tokenA, tokenB, feeAmount, Number(chainId), publicClient)
                            console.log(`poolAddress=${poolAddress}, token0=${tokens[i].symbol}, token1=${tokens[j].symbol}, chainId=${chainId} ,feeAmount=${feeAmount}`)
                        } catch (error) {
                            console.log('poolAddress is invalid due to:', error)
                        }
                    }  
                }
            }
        } 
    }*/

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
            if (chainId === 31337) {
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
        }
    }

    useEffect(() => {
        // const ALCHEMY_WS_URL = 'wss://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am';
        // const POOL_ADDRESS = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'; // eg: pool USDC/ETH 0.3% 
        // const poolListenter = new BrowserUniswapV3PoolListener(POOL_ADDRESS, ALCHEMY_WS_URL) 
        // setListener(poolListenter)

        // return () => listener?.disconnect()
    }, [])

    return {getLatestResult, addWebSocketListener, getLatestPoolInfo}
}

export default useWebSocketHook