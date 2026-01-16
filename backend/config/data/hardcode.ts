import { mainnet, bsc, polygon, base, arbitrum, celo, 
  avalanche, blast, unichain, worldchain, zksync, zora,
  sepolia, baseSepolia, arbitrumSepolia, celoSepolia,unichainSepolia, zoraSepolia,
  hardhat} from 'viem/chains';
import { Chain } from 'viem';
import dotenv from 'dotenv';
import { TokenListType } from '../../controllers/types';
dotenv.config();

/**
 * How to refactor this file: 
 *  1. we should prepare an excel containing the inforation as below
 *  2. There should be an administor portal to import this file
 *  3. backend cannot start if tokenList is empty
 *  */ 

export const tokenList: TokenListType = [
    {
      chainId: 1,  
      network_enum: 'eth-mainnet',
      tokens: [
        {chainId: 1, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}, 
        {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        {chainId: 1, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'},
        {chainId: 1, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'},
        {chainId: 1, name: 'ChainLink Token', symbol: 'LINK', alias: 'link', decimal: 18, address: '0x514910771AF9Ca656af840dff83E8264EcF986CA'}
      ]
    },
    {
      chainId: 56,  
      network_enum: 'bnb-mainnet',
      tokens: [
        {chainId: 56, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 18, address: '0x55d398326f99059ff775485246999027b3197955'}, 
        {chainId: 56, name: 'ChainLink Token', symbol: 'LINK', alias: 'link', decimal: 18, address: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd'}
      ]
    },
    {
      chainId: 8453,  
      network_enum: 'base-mainnet',
      tokens: []
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
      chainId: 84532,  
      network_enum: 'base-sepolia',
      tokens: []
    },
    {
      chainId: 11155111,  
      network_enum: 'eth-sepolia',
      tokens: [
        {chainId: 11155111, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'}, 
        {chainId: 11155111, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'},
        {chainId: 11155111, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0x5ab10C716716f6F1a2a0848BB6B36B89d7F5A24d'},
        {chainId: 11155111, name: 'ChainLink Token', symbol: 'LINK ', alias: 'link', decimal: 18, address: '0x779877A7B0D9E8603169DdbD7836e478b4624789'},
      ]
    },
    {
      chainId: 31337,  
      network_enum: 'localhost',
      tokens: [
        {chainId: 31337, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}, 
        {chainId: 31337, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        {chainId: 31337, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'},
        {chainId: 31337, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'},
        {chainId: 31337, name: 'ChainLink Token', symbol: 'LINK', alias: 'link', decimal: 18, address: '0x514910771AF9Ca656af840dff83E8264EcF986CA'}
      ]
    }
  ]

export const chainUrls = new Map<number, [Chain, string, string]>([
  [Number(mainnet.id), [mainnet, `https://eth-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://eth-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(base.id), [base, `https://base-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://base-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(bsc.id), [bsc, `https://bnb-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://bnb-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(polygon.id), [polygon, `https://polygon-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://polygon-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(arbitrum.id), [arbitrum, `https://arb-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://arb-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(celo.id), [celo, `https://celo-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://celo-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(avalanche.id), [avalanche, `https://avax-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://avax-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(blast.id), [blast, `https://blast-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://blast-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(unichain.id), [unichain, `https://unichain-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://unichain-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(worldchain.id), [worldchain, `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://worldchain-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(zksync.id), [zksync, `https://zksync-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://zksync-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(zora.id), [zora, `https://zora-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://zora-mainnet.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  // below are for testnets
  [Number(sepolia.id), [sepolia, `https://eth-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://eth-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(baseSepolia.id), [sepolia, `https://base-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://base-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(arbitrumSepolia.id), [arbitrumSepolia, `https://arb-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://arb-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(celoSepolia.id), [celoSepolia, `https://celo-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://celo-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(unichainSepolia.id), [unichainSepolia, `https://unichain-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://unichain-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  [Number(zoraSepolia.id), [zoraSepolia, `https://zora-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`, `wss://zora-sepolia.g.alchemy.com/v2/${process.env.PUBLIC_ALCHEMY_ID}`]],
  //for local test
  [Number(hardhat.id), [hardhat, 'http://127.0.0.1:8545', `http://127.0.0.1:8545`]]
])

/**
 *  100 -> 100 / 1,000,000 = 0.0001 -> 0.01%
 *  500 -> 500 / 1,000,000 = 0.0005 -> 0.05%
    3000 -> 3000 / 1,000,000 = 0.003 -> 0.3%
    10000 -> 10000 / 1,000,000 = 0.01 -> 1%
 */
export const FEE_TIERS = [
  {value: 0.01, description: 'Best for very stable pairs.'}, 
  {value: 0.05, description: 'Best for stable pairs.'},
  {value: 0.3, description: 'Best for most pairs.'},
  {value: 1, description: 'Best for exotic pairs.'},
]
  


