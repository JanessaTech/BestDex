
const CoinbaseWallet = () => {
    return (
        <li className="h-[100px] flex items-center hover:bg-zinc-200 px-5 border-b-[2px]">
                    <div className="w-[40px] h-[40px] border border-zinc-300 rounded-lg 
                                bg-white flex justify-center items-center">
                        <img src="/imgs/wallets/coinbase.svg" 
                            alt="metamask wallet" 
                            width={25} height={25}/>
                    </div>
                    <span className="ml-2">Coinbase Wallet</span>
        </li>
    )
}

export default CoinbaseWallet