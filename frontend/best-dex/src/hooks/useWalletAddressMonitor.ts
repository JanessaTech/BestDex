import { AuthState, WalletAddressChangeState, authState, walletAddressChangeState } from "@/lib/atoms"
import logger from "@/lib/logger"
import { useEffect } from "react"
import { useRecoilState } from "recoil"

//todo: failed to monitor accountsChanged event
const useWalletAddressMonitor = () => {
    const [auth, setAuth] = useRecoilState<AuthState>(authState)
    const [walletState, setWalletState] = useRecoilState<WalletAddressChangeState>(walletAddressChangeState)

    const handleWalletAddressChanged = (accounts: any) => { 
        logger.debug('[useWalletAddressMonitor] handleWalletAddressChanged.')
        logger.debug('auth: ', auth)
        if (auth.loginedUser) {
            setWalletState({changed: true})
        }
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
    })
}

export default useWalletAddressMonitor