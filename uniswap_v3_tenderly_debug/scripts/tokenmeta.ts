
const apiKey = 'QLyqy7ll-NxAiFILvr2Am'
const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;

export const tokenList: TokenListType = [
  {
    chainId: 1,  
    network_enum: 'eth-mainnet',
    tokens: [
      {chainId: 1, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}, 
      {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
      {chainId: 1, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'},
      {chainId: 1, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'}
    ]
  },
  {
    chainId: 137,  
    network_enum: 'polygon-mainnet',
    tokens: [
      {chainId: 137, name: 'Polygon Ecosystem Token', symbol: 'POL', alias: 'pol', decimal: 18, address: '0x0000000000000000000000000000000000001010'},
      {chainId: 137, name: '(PoS) Tether USD', symbol: 'USDT ', alias: 'usdt', decimal: 6, address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'},
      {chainId: 137, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'},
    ]
  },
  {
    chainId: 42161,  
    network_enum: 'arb-mainnet',
    tokens: [
      {chainId: 42161, name: 'Dai Stablecoin', symbol: 'DAI', alias: 'dai', decimal: 18, address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'},
      {chainId: 42161, name: 'Wrapped BTC', symbol: 'WBTC', alias: 'wbtc', decimal: 8, address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f'},
      {chainId: 42161, name: '1INCH Token', symbol: '1INCH', alias: '1inch', decimal: 18, address: '0x6314c31a7a1652ce482cffe247e9cb7c3f4bb9af'},
      {chainId: 42161, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'},
      {chainId: 42161, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'},
    ]
  },
  {
    chainId: 11155111,  
    network_enum: 'testnet',
    tokens: []
  },
  {
    chainId: 31337,  
    network_enum: 'localhost',
    tokens: [
      {chainId: 31337, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}, 
      {chainId: 31337, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
      {chainId: 31337, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'},
      {chainId: 31337, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'}
    ]
  }
]


const tokens = [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    '0xz'
]

type TokenType = {
    chainId: number;
    name: string;
    symbol: string;
    decimal: number;
    alias: string;
    address: `0x${string}`;
    company?: string;
}
type Network_Enum = 'eth-mainnet' | 'arb-mainnet' | 'bnb-mainnet' | 'polygon-mainnet' | 'localhost' | 'testnet'
type TokenListType = {chainId: number, network_enum: Network_Enum, tokens: TokenType[]}[]

async function getTokenMetadata() {
    try {
        // The token address we want to query for metadata
        const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        const requestBody = {
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getTokenMetadata",
          params: [tokenAddress]
        };
        const response = await fetch(baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (data.error) {
          console.error('Error:', data.error);
          return;
        }
        console.log("TOKEN METADATA");
        console.log(data.result);
      } catch (error) {
        console.error('Request failed:', error);
      }
}

async function fetchWithAllSettled() {
    const results = await Promise.allSettled(
        tokens.map((token) => ({
            jsonrpc: "2.0",
            id: 1,
            method: "alchemy_getTokenMetadata",
            params: [token]
        })).map((requestBody) => fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(res => res.json()))
    )
    results.forEach((res: any, index) => {
        if (res.value.result) {
            console.log(res.value.result)
        }
        if (res.value.error) {
            console.log(res.value.error)
        }
    })  
}
const getTokenMeta = (chainId: number, address: `0x${string}`) => {
  const found = tokenList.find((e) => e.chainId === chainId)?.tokens?.find((token) => token.address.toLowerCase() === address.toLocaleLowerCase())
  return found
}

//getTokenMetadata()
//fetchWithAllSettled()
const res = getTokenMeta(138, '0xc2132D05D31c914a87C6611C10748AEb04B58e8f')
console.log(res)
//npx hardhat run scripts\tokenmeta.ts