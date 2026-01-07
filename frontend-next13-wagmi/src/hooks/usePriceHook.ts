import { useEffect, useState } from "react"
import { ChainId } from '@uniswap/sdk-core'
import { getLatestPrices } from "@/lib/client/TokenPrices";
import { LocalChainIds} from "@/common/types";
import logger from "@/common/Logger";
import { NETWORK_ENUM } from "@/lib/client/types";
import useTokenListHook from "./useTokenListHook";


const span = 10000
export type TokenPriceInUSDType = {
    [K in (ChainId | LocalChainIds)]?: Map<`0x${string}`, string>
}

type ReturnPriceType = {
    network: NETWORK_ENUM;
    address: `0x${string}`;
    prices: {
        currency: string;
        value: string;
        lastUpdatedAt: string
    }[]
}

const usePriceHook = () => {
    const [tokenPrices, setTokenPrice] = useState<TokenPriceInUSDType>({})
    const tokenList = useTokenListHook()
    
    useEffect(() => {
        const fetchTokenPrices = async () => {
            try {
                if (!tokenList.length) throw new Error('No token list found')
                const networkChainMap = new Map(tokenList.map((chain) => [chain.network_enum, chain.chainId]))
                const latestPricesRes = await getLatestPrices()
                updateTokenPrices(latestPricesRes['data'] as ReturnPriceType[], networkChainMap)
            } catch(e) {
                logger.error('[usePriceHook] failed to get latest prices due to ', e)
            }
        }

        let interval: NodeJS.Timeout

        if (tokenList.length) {
            fetchTokenPrices()
            interval = setInterval(fetchTokenPrices, span)
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }  
        }
    }, [tokenList]) 

    const updateTokenPrices = (latestPrices: ReturnPriceType[], networkChainMap: Map<NETWORK_ENUM, number>) => {
        latestPrices.forEach((item) => {
            const chainId = networkChainMap.get(item.network) as ChainId
            const address = item.address
            const usd =  item.prices.filter((price) => price.currency === 'usd')
            const value = usd && usd.length ? usd[0].value : ''
            if (chainId) {
                if(tokenPrices[chainId]) {
                    tokenPrices[chainId]?.set(address, value)
                } else {
                    tokenPrices[chainId] = new Map([[address, value]])
                }
                setTokenPrice({...tokenPrices})
            } else {
                logger.error('[usePriceHook] cannot find chainId by network ', item.network, 'Please fix it')
            }
        })
    }

    return {tokenPrices}
}

export default usePriceHook