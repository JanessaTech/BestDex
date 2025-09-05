import { useEffect, useState } from "react"
import BrowserUniswapV3PoolListener from "./listeners/BrowserUniswapV3PoolListener"


const useWebSocketHook = () => {
    const [listener, setListener] = useState<BrowserUniswapV3PoolListener>()

    const getLatestResult = () => {
        return listener?.getLatestResult()
    }

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