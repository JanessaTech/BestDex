import { useEffect, useState } from "react"
import logger from "@/lib/logger"
import { GetCurrentWalletProvider } from "@/lib/wallet"
import { useRecoilState } from "recoil"
import { type AuthState, authState } from "@/lib/atoms"
import MetaMaskWallet from "./MetaMaskWallet"
import WalletCollectWallet from "./WalletCollectWallet"
import CoinbaseWallet from "./CoinbaseWallet"

type WalletConnectProps = {}

const WalletConnect: React.FC<WalletConnectProps> = (wallet: any) => {
    const [walletProvider, setWalletProvider] = useState(undefined)
    const [auth, setAuth] = useRecoilState<AuthState>(authState)

    useEffect(() => {
        if (window.ethereum) {
            logger.debug('[WalletConnect] add handleWalletAddressChanged to monitor the change of wallet address')
            window.ethereum.on('accountsChanged', handleWalletAddressChanged)
        }
        if (wallet) {
            const provider = GetCurrentWalletProvider()
            if (provider) {
                logger.debug('[WalletConnect] useEffect. setWalletProvider in case signup or refresh page')
                setWalletProvider(provider)
            }
        }
        return () => {
            if(window.ethereum) { 
                logger.debug('[WalletConnect] remove handleWalletAddressChanged')
                window.ethereum.removeListener('accountsChanged', handleWalletAddressChanged);
            }
        }
    })
    const handleWalletAddressChanged = (accounts: any) => { 
        logger.debug('[WalletConnect] handleWalletAddressChanged. wallet=', wallet)
        if (wallet) { 
            //notifyWalletAddressChange()
        }
    }
    return (
        <div className="max-md:m-4 text-zinc-600">
            <div className="font-semibold">Collect a wallet</div>
            <ul className="bg-zinc-100 rounded-lg font-semibold my-4 cursor-pointer overflow-hidden text-black">
                <MetaMaskWallet/>
                <WalletCollectWallet/>
                <CoinbaseWallet/>
            </ul>
            <div>
                <span className="text-xs">By connecting a wallet, you agree to BEST DEX's Terms of Service and consent to its Privacy Policy.</span>
            </div>
        </div>
    )
}

export default WalletConnect