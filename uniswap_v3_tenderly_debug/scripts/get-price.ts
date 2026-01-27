// prices-fetch-script.js

// Replace with your Alchemy API key:
const apiKey = "QLyqy7ll-NxAiFILvr2Am";


export const NETWORK_CONSTANTS = {
  MAINNET: ['eth-mainnet', 'arb-mainnet', 'bnb-mainnet', 'base-mainnet'] as const,
  TESTNET: ['eth-sepolia', 'base-sepolia'] as const,
  LOCAL: ['localhost'] as const
} as const
export type MAINNET_ENUM = typeof NETWORK_CONSTANTS.MAINNET[number]
type TESTNET_ENUM = typeof NETWORK_CONSTANTS.TESTNET[number]
type LOCALNET_ENUM = typeof NETWORK_CONSTANTS.LOCAL[number]
export type NETWORK_ENUM = MAINNET_ENUM | TESTNET_ENUM | LOCALNET_ENUM;
type ReturnPriceType = {
  network: NETWORK_ENUM;
  address: `0x${string}`;
  prices: {
      currency: string;
      value: string;
      lastUpdatedAt: string
  }[]
}

// Define the network and contract addresses you want to fetch prices for.
const allAddresses = [
    {
      network: 'eth-mainnet',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    {
      network: 'eth-mainnet',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },
    {
      network: 'eth-mainnet',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    {
      network: 'bnb-mainnet',
      address: '0x55d398326f99059ff775485246999027b3197955'
    },
    {
      network: 'bnb-mainnet',
      address: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd'
    },
    {
      network: 'arb-mainnet',
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
    },
    {
      network: 'arb-mainnet',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
    },
    {
      network: 'base-mainnet',
      address: '0x88fb150bdc53a65fe94dea0c9ba0a6daf8c6e191'
    }
  ]

async function getTokenPricesByAddress() {
  const res: {data: any[]} = {data: []}
  try {
    for (let i = 0; i < allAddresses.length; i += 3) {
      const addresses = allAddresses.slice(i, i + 3)
      const response = await fetch('https://api.g.alchemy.com/prices/v1/tokens/by-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ addresses})
      });
      const data = await response.json() as {data: any[]};
      res.data.push(...data.data)
      
      console.log("Token Prices By Address:");
      console.log(JSON.stringify(data, null, 2));
    }

    console.log(JSON.stringify(res, null, 2));
    

    
  } catch (error) {
    console.error("Error:", error);
  }
}

getTokenPricesByAddress();

// how to run:
// npx hardhat run .\scripts\get-price.ts