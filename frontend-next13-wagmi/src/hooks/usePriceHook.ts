import { useEffect, useState } from "react"
import { ChainId } from '@uniswap/sdk-core'
import { tokenList } from "@/lib/data";
import { getLatestPrices } from "@/lib/client/TokenPrices";
import { LocalChainIds, Network_Enum } from "@/common/types";
import logger from "@/common/Logger";


const span = 10000
export type TokenPriceInUSDType = {
    [K in ChainId | LocalChainIds]?: Map<`0x${string}`, string>
}

type ReturnPriceType = {
    network: Network_Enum;
    address: `0x${string}`;
    prices: {
        currency: string;
        value: string;
        lastUpdatedAt: string
    }[]
}

const usePriceHook = () => {
    const [tokenPrices, setTokenPrice] = useState<TokenPriceInUSDType>({})
    const networkEnumIdMap = new Map(tokenList.map((chain) => [chain.network_enum, chain.chainId]))
    
    useEffect(() => {
        const fetchTokenPrices = async () => {
            try {
                const res = await getLatestPrices()
                updateTokenPrices(res['data'] as ReturnPriceType[])
            } catch(e) {
                logger.error('[usePriceHook] failed to get latest prices due to ', e)
            }
        }

        fetchTokenPrices()

        const interval = setInterval(fetchTokenPrices, span)

        return () => {
            clearInterval(interval)
        }
    }, []) 

    const updateTokenPrices = (latestPrices: ReturnPriceType[]) => {
        latestPrices.forEach((item) => {
            const chainId = networkEnumIdMap.get(item.network) as ChainId
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