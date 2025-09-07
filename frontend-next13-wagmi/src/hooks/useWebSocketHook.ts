import { useEffect, useState } from "react"
import BrowserUniswapV3PoolListener from "./listeners/BrowserUniswapV3PoolListener"
import { chainUrls } from "@/config/wagmi"
import { tokenList } from "@/lib/data"
import { FEE_TIERS } from "@/config/constants"
import { PoolInfo, calcPoolAddress } from "@/lib/tools/pool"
import { 
    usePublicClient
  } from 'wagmi'

const useWebSocketHook = (chainId: number) => {
    const [listener, setListener] = useState<BrowserUniswapV3PoolListener>()
    const [listenersMap, setListenersMap] = useState<Map<string, Map<`0x${string}`, PoolInfo>>>(new Map([]))
    const publicClient = usePublicClient({chainId})
    const getLatestResult = () => {
        return listener?.getLatestResult()
    }

    useEffect(() => {
        computePoolAddresses(chainId)
    }, [chainId])

    const computePoolAddresses = async (chainId: number) => {
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
    }

    useEffect(() => {
        const ALCHEMY_WS_URL = 'wss://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am';
        const POOL_ADDRESS = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'; // eg: pool USDC/ETH 0.3% 
        const poolListenter = new BrowserUniswapV3PoolListener(POOL_ADDRESS, ALCHEMY_WS_URL) 
        setListener(poolListenter)

        return () => listener?.disconnect()
    }, [])

    return {getLatestResult}
}

export default useWebSocketHook