import { useRecoilState } from "recoil"
import { type AuthState, authState } from "@/lib/atoms"
import MetaMaskWallet from "./MetaMaskWallet"
import WalletCollectWallet from "./WalletCollectWallet"
import CoinbaseWallet from "./CoinbaseWallet"

type WalletConnectProps = {
    onClose: (open: boolean) => void
}

const WalletConnect: React.FC<WalletConnectProps> = ({onClose}) => {
    const [auth, setAuth] = useRecoilState<AuthState>(authState)

    return (
        <div className="max-md:m-4 text-zinc-600">
            <div className="font-semibold">Collect a wallet</div>
            <ul className="bg-zinc-100 rounded-lg font-semibold my-4 cursor-pointer overflow-hidden text-black">
                <MetaMaskWallet onClose={onClose}/>
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