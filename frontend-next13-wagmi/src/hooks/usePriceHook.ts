import { useEffect, useState } from "react"
import { ChainId } from '@uniswap/sdk-core'
import { tokenList } from "@/lib/data";
import { Network_Enum, LocalChainIds } from "@/lib/types";

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
        const interval = setInterval(() => {
            
            (async () => {
                console.log('call apis to get the latest prices')
                try {
                    const latestPrices = await getLatestPrices()
                    updateTokenPrices(latestPrices)
                } catch(e) {
                    console.error('failed to get latest prices due to ', e)
                }
                

            })()
        }, 20000)
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
                console.error('cannot find chainId by network ', item.network, 'Please fix it')
            }
        })
    }

    const getLatestPrices = async () => {
        const url = `https://api.g.alchemy.com/prices/v1/${process.env.NEXT_PUBLIC_ALCHEMY_ID}/tokens/by-address`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
        };
        const addresses: any = []

        tokenList.filter((chain) => chain.network_enum !== 'localhost' && chain.network_enum !== 'testnet').forEach((chain) => chain.tokens.forEach((token) => addresses.push({network: chain.network_enum, address: token.address})))

        const data = {addresses: addresses}

        //console.log('data:', data)

        try {
            const startTime = performance.now()
            const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
            });
    
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const res = await response.json();
            //console.log(JSON.stringify(res, null, 2)); 
            let endTime = performance.now()
            let executionTime = endTime - startTime
            //console.log('it takes times:', executionTime)
            return res['data'] as ReturnPriceType[]; 
        } catch (error) {
            console.error('Fetch error:', error);
            throw error
        }
    }

    return {tokenPrices}
}

export default usePriceHook