import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import NetworkConnect from "../network/NetworkConnect"
import type { NetworkType } from "@/lib/types"
import { useState } from "react"
import { defaultNetwork } from "@/lib/constants"
import Search from "@/lib/svgs/Search"

type TokenSelectProps = {}

const TokenSelect: React.FC<TokenSelectProps> = () => {
    const [network, setNetwork] = useState<NetworkType>(defaultNetwork)
    const [isNetworkOpen, setIsNetworkOpen] = useState<boolean>(false)
    const [searchToken, setSearchToken] = useState<string>('')

    const handleNetworkChange = (network: NetworkType) => {
        setNetwork(network)
        setIsNetworkOpen(false)
    }
    
    const onOpenChange = (open: boolean) => {
        console.log('onOpenChange:', open)
        setIsNetworkOpen(open)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        console.log('input value:', e.target.value)
        setSearchToken(e.target.value)
    }

    return (
        <div className="w-full my-2">
            <div className="flex justify-between items-center relative">
                <input 
                    id='search'
                    name='search'
                    type="text"
                    placeholder="Search name or paste address"
                    className="border border-zinc-300 h-[40px] 
                    rounded-lg text-black px-10 grow mr-2"
                    onChange={handleInputChange}
                />
                <Search className="text-zinc-300 w-[25px] h-[25px] absolute left-2"/>
                <Popover onOpenChange={onOpenChange} open={isNetworkOpen}>
                    <PopoverTrigger>
                        <img src={`/imgs/networks/${network.name}.png`}  alt={network.name} className="cursor-pointer"/>
                    </PopoverTrigger>
                    <PopoverContent align='end'>
                        <NetworkConnect network={network} handleNetworkChange={handleNetworkChange}/>
                    </PopoverContent>
                </Popover> 
            </div>
            <div className="flex flex-wrap my-3">
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
                <div className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3">
                    <img src="/imgs/tokens/eth.png" alt="eth" width={25} height={25}/>
                    <span className="mx-2 text-black">ETH</span>
                </div>
            </div>
            <div className="border-t border-zinc-300 w-full my-3"></div>
            <div className="h-[500px] overflow-auto">
                <div className="text-zinc-400 my-2">Popular Token</div>
                <ul>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                    <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                        <img src="/imgs/tokens/0x.png" alt="eth" />
                        <div className="ml-3">
                            <div className="text-black">0x Protocal</div>
                            <div className="text-zinc-400 text-xs">ZRX</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TokenSelect