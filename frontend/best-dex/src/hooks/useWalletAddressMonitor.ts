import logger from "@/lib/logger"
import { useEffect } from "react"

//todo: failed to monitor accountsChanged event
const useWalletAddressMonitor = () => {
    const handleWalletAddressChanged = (accounts: any) => { 
        logger.debug('[useWalletAddressMonitor] handleWalletAddressChanged. wallet=', true)
    }

    useEffect(() => {
        if (window.ethereum) {
            logger.debug('[useWalletAddressMonitor] add handleWalletAddressChanged to monitor the change of wallet address')
            window.ethereum.on('accountsChanged', handleWalletAddressChanged)
        }
        return () => {
            if(window.ethereum) { 
                logger.debug('[useWalletAddressMonitor] remove handleWalletAddressChanged')
                window.ethereum.removeListener('accountsChanged', handleWalletAddressChanged);
            }
        }
    }, [])
}

export default useWalletAddressMonitor