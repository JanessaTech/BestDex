import useQueryTokenList from "@/hooks/useQueryTokenList"
import { useState } from "react"
import TokenListSkeleton from "./TokenListSkeleton"
import type { TokenType } from "@/lib/types"

type TokenListprops = {
    chainId: number,
    searchToken: string,
    handleTokenChange: (newToken: TokenType) => void
}

const TokenList: React.FC<TokenListprops>=  ({chainId, searchToken, handleTokenChange}) => {
    const [loadingTokens, setLoadingTokens] = useState<boolean>(false)
    const tokenList = useQueryTokenList({chainId, searchToken, setLoadingTokens})

    return (
        <div className="h-[500px] overflow-auto">
                <div className="text-zinc-400 my-2 sticky top-0 bg-white">{searchToken ? 'Search results': 'Popular Tokens'}</div>
                <ul>
                    {loadingTokens ? new Array<number>(10).fill(1).map((v,i) => <TokenListSkeleton index={i}/>) :
                        tokenList.length === 0 ? <div className="text-zinc-600 text-center">No token found</div> :
                        tokenList.map((token) => (
                            <li key={`${token.chainId}_${token.symbol}`} className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-lg"
                               onClick={() => handleTokenChange(token)}>
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