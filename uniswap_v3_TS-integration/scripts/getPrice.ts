import { ethers, BigNumber } from 'ethers'
import { createClient, gql } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core'
import { Decimal } from 'decimal.js';


/**
 * About this script:
 * The script is used to get price for a token. The work flow is like this:
 * 1. Get derivedETH by reading subgraph
 * 2. Get ETH-USD price by Chainlink or CoinGecko API
 * 3. Calculate the final price based on #1 and #2
 */

//const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am") // ethereum-mainnet
//const provider = new ethers.providers.JsonRpcProvider("https://arb-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am") // Arbitrum-one
const provider = new ethers.providers.JsonRpcProvider("https://bnb-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am") // BNB
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

 const getDerivedPrice: () => Promise<string> = async () => {
    const client = createClient({
        //url: 'https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV', // ethereum mainnet
        //url: 'https://gateway.thegraph.com/api/subgraphs/id/3V7ZY6muhxaQL5qvntX1CFXJ32W7BxXZTGTwmpH5J4t3', // Arbitrum One
        url: 'https://gateway.thegraph.com/api/subgraphs/id/F85MNzUGYqgSHSHRGgeVMNsdnW1KtZSVgFULumXRZTw2', //BNB
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
    //const tokenAddress = '0x514910771af9ca656af840dff83e8264ecf986ca'  //LINK in ethereum
    //const tokenAddress = '0xf97f4df75117a78c1a5a0dbb814af92458539fb4'  //LINK in Arbitrum One
    const tokenAddress = '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd'  //LINK in BNB
    const result = await client.query(DATA_QUERY,{id: tokenAddress.toLowerCase()}).toPromise();
    if (result.error) {
        console.error('Failed to get derived price from uniswap v3 subgraphs')
        throw new Error(result.error.message)
    }
    if (!result?.data?.token?.derivedETH) throw new Error('The result returned from uniswap v3 subgraphs does not contain derivedETH')
    return result.data.token.derivedETH
}


const getPairPriceFromCoinGecko = async () => {
    try {
        const url  = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'

        const response = await fetch(url)
        const data:any = await response.json()
        return data['ethereum']['usd'] as string
    } catch (e) {
        console.error('failed to read price from CoinGecko due to:', e)
        throw new Error('Failed to read price from CoinGecko')
    }
}
const getPairPriceFromChainlink  = async () => {
    //const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"  // ETH/USD -- Ethereum Mainnet
    //const addr = "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612" // ETH/USD -- Arbitrum One Mainnet
    const addr = "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e" // ETH/USD -- BNB

    try {
        const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
        try {
            const hexValue = await priceFeed.latestAnswer();
            const rawValue = BigNumber.from(hexValue);
            const decimals = await priceFeed.decimals();
            console.log('rawValue:', rawValue)
            console.log('decimals:', decimals)        
            let valueStr = rawValue.toString().padStart(decimals + 1, '0');
            
            const integerPart = valueStr.slice(0, -decimals) || '0';
            const fractionalPart = valueStr.slice(-decimals).replace(/0+$/, '');
        
            return fractionalPart.length > 0 
                ? `${integerPart}.${fractionalPart}`
                : integerPart;
            } catch (error) {
                console.error('Error processing price:', error);
                throw error;
            }
    } catch (e) {
        console.error('failed to read price from Chainlink due to:', e)
        throw new Error('Failed to read price from Chainlink')
    }
}

function roundPrecise(value: string, precision: number): string {
    return new Decimal(value)
      .toDecimalPlaces(precision, Decimal.ROUND_HALF_UP)
      .toString();
  }

async function getPriceFromCoinGeckoOrChainLink() {
    const derivedETH = await getDerivedPrice()
    console.log('derivedETH =', derivedETH)
    const res1 = new Decimal(derivedETH)
    try {
        const coinGeckoPrice = await getPairPriceFromCoinGecko()
        console.log('coinGeckoPrice =', coinGeckoPrice)
        const res2 = new Decimal(coinGeckoPrice)
        const final1 = res1.times(res2).toDecimalPlaces(4).toString();
        console.log('final1 =', final1)

    } catch (e) {
        console.error('Failed to get price from GeckoPrice due to: ', e)
    }
    try {
        const chainlinkPrice = await getPairPriceFromChainlink()
        const res3 = new Decimal(chainlinkPrice)
        console.log('chainlinkPrice =', chainlinkPrice)
        const final2 = res1.times(res3).toDecimalPlaces(4).toString();
        console.log('final2 =', final2)
    } catch (e) {
        console.log('failed to get price from chainlink due to:', e)
    } 
}

async function getPrice() {
    await getPriceFromCoinGeckoOrChainLink()
}

getPrice().catch((e) => {
    console.log(e)
})

// how to run:
// npx ts-node .\scripts\getPrice.ts