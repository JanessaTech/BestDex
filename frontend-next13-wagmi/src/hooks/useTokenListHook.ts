import logger from "@/common/Logger"
import { getTokenListFromConfig } from "@/lib/client/Config"
import { ConfiguredTokens } from "@/lib/client/types"
import { useEffect, useState } from "react"

const useTokenListHook = (isWSConnected?: boolean) => {
    const [tokenList, setTokenList] = useState<ConfiguredTokens[]>([])

    useEffect(() => {
        (async () => {
            try {
                const res = await getTokenListFromConfig()
                if (!res) throw new Error('Failed to get the token list')
                    setTokenList(res)
            } catch(e) {
                logger.error('[useTokenListHook] failed to get the token list due to ', e)
            }
        })()
    }, [isWSConnected])

    return tokenList
}
export default useTokenListHook