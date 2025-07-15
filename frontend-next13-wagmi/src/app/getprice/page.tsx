'use client'

import { ethers } from 'ethers'
import { useState } from 'react'
import { createClient, gql } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core'
import { tokenList } from '@/lib/data';

//const provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com")
const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am")
const aggregatorV3InterfaceABI = [
    'function latestAnswer() view returns (int256)',
    'function latestTimestamp() view returns (uint256)',
    'function latestRound() view returns (uint256)',
    'function getAnswer(uint256 _roundId) view returns (int256)',
    'function getTimestamp(uint256 _roundId) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function getRoundData(uint80 _roundId) view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
    'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
    'function description() view returns (string)',
    'function version() view returns (uint256)'
 ]

type GetPriceProps = {}
const GetPrice: React.FC<GetPriceProps> = () => {
    const [price, setPrice] = useState(0)

    const getDerivedPrice: () => Promise<string> = async () => {
        const client = createClient({
            url: 'https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV',
            fetchOptions: {
              headers: {
                Authorization: 'Bearer eada99c8eee80663db1e909b89c14a3f',  // the api key created in https://thegraph.com/studio/apikeys/
              },
            },
            exchanges: [cacheExchange, fetchExchange],
          });
        const DATA_QUERY = gql`
            query GetTokenPrice($id: ID!) {
            token(id: $id) {
            derivedETH
            name
            symbol
            }
        }
        `;
        const tokenAddress = '0x514910771af9ca656af840dff83e8264ecf986ca'  //LINK in ethereum
        //const tokenAddress = '0xf97f4df75117a78c1a5a0dbb814af92458539fb4'  //LINK in Arbitrum One
        const result = await client.query(DATA_QUERY,{id: tokenAddress.toLowerCase()}).toPromise();
        if (result.error) {
            console.error('Failed to get derived price from uniswap v3 subgraphs')
            throw new Error(result.error.message)
        }
        if (!result?.data?.token?.derivedETH) throw new Error('The result returned from uniswap v3 subgraphs does not contain derivedETH')
        return result.data.token.derivedETH
    }

    const getPairPirceFromCoinGecko = async () => {
        try {
            const url  = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
            //const url  = 'https://api.coingecko.com/api/v3/simple/token_price/arbitrum-one?contract_addresses=0x82aF49447D8a07e3bd95BD0d56f35241523fBab1&vs_currencies=usd&include_24hr_change=true'

            const response = await fetch(url)
            const data = await response.json()
            return data['ethereum']['usd'] as string
        } catch (e) {
            console.error('failed to read price from CoinGecko due to:', e)
            throw new Error('Failed to read price from CoinGecko')
        }
    }
    const getPairPriceFromChainlink  = async () => {
        const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"  // ETH/USD -- Ethereum Mainnet
        //const addr = "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612" // ETH/USD -- Arbitrum One Mainnet

        const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
        const latestAnswer = await priceFeed.latestAnswer()
        const decimals = await priceFeed.decimals()
        console.log("latestAnswer", latestAnswer)
        console.log("decimals", decimals)
    }

    const method1 = async () => {
        console.log('onClick....')
        try {
            let startTime = performance.now()
            const derivedETH = await getDerivedPrice()
            let endTime = performance.now()
            let executionTime = endTime - startTime
            console.log('derivedETH takes: ', executionTime)
            startTime = performance.now()
            const pairPrice = await getPairPirceFromCoinGecko()
            endTime = performance.now()
            executionTime = endTime - startTime
            console.log('getPairPirceFromCoinGecko takes: ', executionTime)
            startTime = performance.now()
            await getPairPriceFromChainlink()  // it takes longer time, almost 4 times than using CoinGecko
            endTime = performance.now()
            executionTime = endTime - startTime
            console.log('getPairPriceFromChainlink takes: ', executionTime)
            console.log('derivedETH =', derivedETH)
            console.log('pairPrice =', pairPrice)

        } catch (e) {
            console.error(e)
        }
    }

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
       //await method1()
       const addresses: any = []
       const res =  tokenList.filter((chain) => chain.network_enum !== 'localhost' && chain.network_enum !== 'testnet').forEach((chain) => chain.tokens.forEach((token) => addresses.push({network: chain.network_enum, address: token.address})))
       const data = {
        addresses: addresses
       }
       console.log(data)
    }

    return (
        <div>
            <button 
                className='px-2 py-1 text-xl bg-zinc-500 rounded-full hover:bg-zinc-600 active:bg-zinc-400' 
                onClick={onClick}>Get price</button> <span className='px-2'>{price}</span>
        </div>
    )
}

export default GetPrice