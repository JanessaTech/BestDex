
type WalletConnectProps = {}

const WalletConnect: React.FC<WalletConnectProps> = () => {
    return (
        <div className="max-md:m-4 text-zinc-600">
            <div className="font-semibold">Collect a wallet</div>
            <ul className="bg-zinc-100 rounded-lg font-semibold my-4 cursor-pointer overflow-hidden text-black">
                <li className="h-[100px] flex items-center hover:bg-zinc-200 px-5 border-b-[2px] border-b-white">
                    <div className="w-[40px] h-[40px] border border-zinc-300 rounded-lg 
                                    bg-white flex justify-center items-center">
                        <img src="/imgs/wallets/metamask.svg" 
                            alt="metamask wallet" 
                            width={25} height={25}/>
                    </div>
                    <span className="ml-2">MetaMask</span>
                </li>
                <li className="h-[100px] flex items-center hover:bg-zinc-200 px-5 border-b-[2px] border-b-white">
                    <div className="w-[40px] h-[40px] border border-zinc-300 rounded-lg 
                                bg-white flex justify-center items-center">
                        <img src="/imgs/wallets/walletconnect.svg" 
                            alt="metamask wallet" 
                            width={25} height={25}/>
                    </div>
                    <span className="ml-2">MetaMask</span>
                </li>
                <li className="h-[100px] flex items-center hover:bg-zinc-200 px-5 border-b-[2px]">
                    <div className="w-[40px] h-[40px] border border-zinc-300 rounded-lg 
                                bg-white flex justify-center items-center">
                        <img src="/imgs/wallets/coinbase.svg" 
                            alt="metamask wallet" 
                            width={25} height={25}/>
                    </div>
                    <span className="ml-2">Coinbase Wallet</span>
                </li>
            </ul>
            <div>
                <span className="text-xs">By connecting a wallet, you agree to BEST DEX's Terms of Service and consent to its Privacy Policy.</span>
            </div>
        </div>
    )
}

export default WalletConnect