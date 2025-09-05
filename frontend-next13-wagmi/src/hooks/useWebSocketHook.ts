import { useEffect, useState } from "react"
import BrowserUniswapV3PoolListener from "./listeners/BrowserUniswapV3PoolListener"
import usePoolHook, { PoolInfo } from "./usePoolHook"
import { chainUrls } from "@/config/wagmi"
import { tokenList } from "@/lib/data"
import { FEE_TIERS } from "@/config/constants"

const useWebSocketHook = () => {
    const [listener, setListener] = useState<BrowserUniswapV3PoolListener>()
    const [listenerMap, setListenerMap] = useState<Map<string, Map<`0x${string}`, PoolInfo>>>(new Map([]))
    const {getPoolAddress} = usePoolHook() // call another hook?

    const getLatestResult = () => {
        return listener?.getLatestResult()
    }

    useEffect(() => {
        for (let [chainId, url] of Object.entries(chainUrls)) {
            console.log(`${chainId}, ${url}`)
            const tokens = tokenList.filter((l) => l.chainId === Number(chainId))[0].tokens
            for (let i = 0; i < tokens.length; i++) {
                for (let j = i + 1; j < tokens.length; j++) {
                    for (let feeTier of FEE_TIERS) {
                        const feeAmount = feeTier.value * 10000
                        const tokenA = tokens[i].address
                        const tokenB = tokens[j].address
                        console.log(`chainId=${chainId}, token0=${tokens[i].symbol}, token1=${tokens[j].symbol}, feeTier=${feeTier.value}`)
                        const poolAddress = getPoolAddress(tokenA, tokenB, feeAmount, Number(chainId))
                        // const token0 = new Token(tokens[i].chainId, tokens[i].address, tokens[i].decimal, tokens[i].symbol, tokens[i].name)
                        // const token1 = new Token(tokens[j].chainId, tokens[j].address, tokens[j].decimal, tokens[j].symbol, tokens[j].name)
                        // const feeAmount_enum = Object.values(FeeAmount).includes(feeAmount) ? feeAmount as FeeAmount : undefined
                        // if (!feeAmount_enum) {
                        //     console.log('The wrong number of feeTier')
                        //     continue
                        // } else {
                            
                        // }
                    }
                }
            }
        }
        
    }, [])

    useEffect(() => {
        const ALCHEMY_WS_URL = 'wss://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk';
        const POOL_ADDRESS = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'; // eg: pool USDC/ETH 0.3% 
        const poolListenter = new BrowserUniswapV3PoolListener(POOL_ADDRESS, ALCHEMY_WS_URL) 
        setListener(poolListenter)

        return () => listener?.disconnect()
    }, [])

    return {getLatestResult}

}

export default useWebSocketHook