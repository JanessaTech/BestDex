import Coinbase from "./Coinbase"
import MetaMask from "./MetaMask"
import WalletCollect from "./WalletCollect"

type WalletConnectProps = {}

const WalletConnect: React.FC<WalletConnectProps> = () => {
    return (
        <div className="max-md:m-4 text-zinc-600">
            <div className="font-semibold">Collect a wallet</div>
            <ul className="bg-zinc-100 rounded-lg font-semibold my-4 cursor-pointer overflow-hidden text-black">
                <MetaMask/>
                <WalletCollect/>
                <Coinbase/>
            </ul>
            <div>
                <span className="text-xs">By connecting a wallet, you agree to BEST DEX's Terms of Service and consent to its Privacy Policy.</span>
            </div>
        </div>
    )
}

export default WalletConnect