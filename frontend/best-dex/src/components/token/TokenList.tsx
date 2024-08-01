import useQueryTokenList from "@/hooks/useQueryTokenList"
import { TokenListData } from "@/lib/constants"
import { useState } from "react"
import TokenListSkeleton from "./TokenListSkeleton"

type TokenListprops = {
    chainId: number,
    searchToken: string
}

const TokenList: React.FC<TokenListprops>=  ({chainId, searchToken}) => {
    const [loadingTokens, setLoadingTokens] = useState<boolean>(false)
    const tokenList = useQueryTokenList({chainId, searchToken, setLoadingTokens})

    return (
        <div className="h-[500px] overflow-auto">
                <div className="text-zinc-400 my-2 sticky top-0 bg-white">{searchToken ? 'Search results': 'Popular Tokens'}</div>
                <ul>
                    {loadingTokens ? <TokenListSkeleton/> :
                        tokenList.length === 0 ? <div className="text-zinc-600 text-center">No token found</div> :
                        tokenList.map((token) => (
                            <li className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg">
                                <img src={`/imgs/tokens/${token.name}.png`} alt={token.name} />
                                <div className="ml-3">
                                    <div className="text-black">{token.company}</div>
                                    <div className="text-zinc-400 text-xs">{token.symbol}</div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
    )

}

export default TokenList