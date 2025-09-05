import { useEffect, useState } from "react"
import BrowserUniswapV3PoolListener from "./listeners/BrowserUniswapV3PoolListener"


const useWebSocketHook = () => {
    const [listener, setListener] = useState<BrowserUniswapV3PoolListener>()

    const getLatestResult = () => {
        return listener?.getLatestResult()
    }

    useEffect(() => {
        const poolListenter = new BrowserUniswapV3PoolListener() 
        setListener(poolListenter)

        return () => listener?.disconnect()
    }, [])

    return {getLatestResult}

}

export default useWebSocketHook