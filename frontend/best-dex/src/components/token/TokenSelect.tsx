import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import NetworkConnect from "../network/NetworkConnect"
import type {TokenType } from "@/lib/types"
import {type  NetworkType, defaultNetwork, networkState } from "@/lib/atoms"
import { useState } from "react"
import { TokenListData} from "@/lib/constants"
import Search from "@/lib/svgs/Search"
import TokenList from "./TokenList"
import { useRecoilState } from "recoil"

type TokenSelectProps = {
    handleTokenChange: (newToken: TokenType) => void
}

const TokenSelect: React.FC<TokenSelectProps> = ({handleTokenChange}) => {
    const [network, setNetwork] = useState<NetworkType>(defaultNetwork)
    const [networkCurState, setNetworkCurState] = useRecoilState<NetworkType>(networkState)
    const [isNetworkOpen, setIsNetworkOpen] = useState<boolean>(false)
    const [searchToken, setSearchToken] = useState<string>('')

    const handleNetworkChange = (network: NetworkType) => {
        setNetworkCurState(network)
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
                        <img src={`/imgs/networks/${networkCurState.name}.png`}  alt={networkCurState.name} className="cursor-pointer"/>
                    </PopoverTrigger>
                    <PopoverContent align='end'>
                        <NetworkConnect network={networkCurState} handleNetworkChange={handleNetworkChange}/>
                    </PopoverContent>
                </Popover> 
            </div>
            <div className="flex flex-wrap my-3">
                {
                    TokenListData.recommended?.map((token) => (
                        <div key={token.name} className="border border-zinc-300 rounded-full p-1 
                        w-fit flex items-center cursor-pointer hover:bg-zinc-100 mb-3 mr-3"
                        onClick={() => handleTokenChange(token)}>
                            <img src={`/imgs/tokens/${token.name}.png`} alt={token.name} width={25} height={25}/>
                            <span className="mx-2 text-black">{token.symbol}</span>
                        </div>
                    ))
                }
            </div>
            <div className="border-t border-zinc-300 w-full my-3"></div>
            <TokenList searchToken={searchToken} chainId={network.chainId} handleTokenChange={handleTokenChange}/>
        </div>
    )
}

export default TokenSelect