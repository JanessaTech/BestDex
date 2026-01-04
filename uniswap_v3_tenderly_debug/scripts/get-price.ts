// prices-fetch-script.js

// Replace with your Alchemy API key:
const apiKey = "QLyqy7ll-NxAiFILvr2Am";

// Define the network and contract addresses you want to fetch prices for.
/*
const addresses = [
  {
    network: "eth-mainnet",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  },
  {
    network: "eth-mainnet",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7"
  }
];*/

const addresses = [
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
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'
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
        network: 'eth-sepolia',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    }
  ]

async function getTokenPricesByAddress() {
  try {
    const response = await fetch('https://api.g.alchemy.com/prices/v1/tokens/by-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ addresses })
    });

    const data = await response.json();
    console.log("Token Prices By Address:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

getTokenPricesByAddress();

// how to run:
// npx hardhat run .\scripts\get-price.ts