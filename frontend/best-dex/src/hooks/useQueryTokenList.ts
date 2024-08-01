import { TokenListData } from "@/lib/constants"
import type { TokenType } from "@/lib/types"
import { useEffect, useState } from "react"

type UseQueryTokenListProps = {
    chainId: number,
    searchToken: string,
    setLoadingTokens: React.Dispatch<React.SetStateAction<boolean>>
}
const useQueryTokenList = ({chainId, searchToken, setLoadingTokens}: UseQueryTokenListProps) => {
    const [tokenList, setTokenList] = useState<TokenType[]>([])

    useEffect( () => {
        const getTokenList = async () => {
            setLoadingTokens(true)
            console.log('start loading token list')
            await new Promise(resolve => setTimeout(() => {resolve(1)}, 1000))  // mock the deaply when calling http
            console.log('finish loading token list')
            setTokenList(searchToken ? TokenListData.searched || [] : TokenListData.popular || [])
            setLoadingTokens(false)
        }
        getTokenList()

    }, [searchToken])
    return tokenList
}

export default useQueryTokenList