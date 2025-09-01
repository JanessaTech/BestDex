import type { TokenListType, TokenType } from "./types"
import  {  TransactionType } from "./types"

export const tokenList: TokenListType = [
    {
      chainId: 1,  
      network_enum: 'eth-mainnet',
      tokens: [
        {chainId: 1, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}, 
        {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        {chainId: 1, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'}
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
        {chainId: 42161, name: '1INCH Token', symbol: '1INCH', alias: '1inch', decimal: 18, address: '0x6314c31a7a1652ce482cffe247e9cb7c3f4bb9af'}
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
        {chainId: 31337, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'}
      ]
    }
  ]
  

type PositionProps = {
    id: number,
    token0: TokenType,
    token1: TokenType,
    lowTick: number,
    highTick: number,
    liquidity: number,
    status: boolean,
    fee: number,
    wallet: string
}

export const PositionListData: PositionProps[] = [
    {
        id: 11111111, 
        token0: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        token1: {chainId: 1, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}, 
        lowTick: 12456,
        highTick: 456787,
        liquidity: 758845612347588,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0: {chainId: 1, name: 'Wrapped BTC', symbol: 'WBTC', alias: 'wbtc', decimal: 8, address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'},
        token1: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0: {chainId: 1, name: '0x Protocol Token', symbol: 'ZRX', alias: '0x', decimal: 18, address: '0xe41d2489571d322189246dafa5ebde1f4699f498', company: 'ZRX'},
        token1: {chainId: 1, name: 'AIOZ Network', symbol: 'AIOZ', alias: 'aioz', decimal: 18, address: '0x626e8036deb333b408be468f951bdb42433cbf18', company: 'AIOZ'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 3333333, 
        token0: {chainId: 1, name: '0x Protocol Token', symbol: 'ZRX', alias: '0x', decimal: 18, address: '0xe41d2489571d322189246dafa5ebde1f4699f498', company: 'ZRX'},
        token1: {chainId: 1, name: 'AIOZ Network', symbol: 'AIOZ', alias: 'aioz', decimal: 18, address: '0x626e8036deb333b408be468f951bdb42433cbf18', company: 'AIOZ'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 44444444, 
        token0: {chainId: 1, name: '0x Protocol Token', symbol: 'ZRX', alias: '0x', decimal: 18, address: '0xe41d2489571d322189246dafa5ebde1f4699f498', company: 'ZRX'},
        token1: {chainId: 1, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 11111111, 
        token0: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        token1:  {chainId: 1, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0xdac17f958d2ee523a2206206994597c13d831ec7'}, 
        lowTick: 12456,
        highTick: 456787,
        liquidity: 758845612347588,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0: {chainId: 1, name: 'Wrapped BTC', symbol: 'WBTC', alias: 'wbtc', decimal: 8, address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'},
        token1: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: '0x Protocol Token', symbol: 'ZRX', alias: '0x', decimal: 18, address: '0xe41d2489571d322189246dafa5ebde1f4699f498', company: 'ZRX'},
        token1: {chainId: 1, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 3333333, 
        token0: {chainId: 1, name: '0x Protocol Token', symbol: 'ZRX', alias: '0x', decimal: 18, address: '0xe41d2489571d322189246dafa5ebde1f4699f498', company: 'ZRX'},
        token1: {chainId: 1, name: 'Aave Token', symbol: 'AAVE ', alias: 'aave', decimal: 18, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 44444444, 
        token0: {chainId: 1, name: '0x Protocol Token', symbol: 'ZRX', alias: '0x', decimal: 18, address: '0xe41d2489571d322189246dafa5ebde1f4699f498', company: 'ZRX'},
        token1: {chainId: 1, name: 'AIOZ Network', symbol: 'AIOZ', alias: 'aioz', decimal: 18, address: '0x626e8036deb333b408be468f951bdb42433cbf18', company: 'AIOZ'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    }
]

type TransactionProps = {
  time: string,
  tx: string,
  type: TransactionType,
  token0: TokenType,
  token1: TokenType,
  token0Amount: number,
  token1Amount: number,
  wallet: string
}

export const TransactionListData: TransactionProps[] = [
  {
      time: '6s ago', 
      tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
      type: TransactionType.Swap, 
      token0: {chainId: 1, name: 'Wrapped BTC', symbol: 'WBTC', alias: 'wbtc', decimal: 8, address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'},
      token1: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  },
  {
      time: '1 day ago', 
      tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
      type: TransactionType.BurnPosition, 
      token0: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
      token1: {chainId: 1, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0xdac17f958d2ee523a2206206994597c13d831ec7'}, 
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  },
  {
      time: '2 days ago', 
      tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
      type: TransactionType.AddLiquidity, 
      token0: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
      token1: {chainId: 1, name: 'Tether USD', symbol: 'USDT', alias: 'usdt', decimal: 6, address: '0xdac17f958d2ee523a2206206994597c13d831ec7'}, 
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  },
  {
      time: '3 days ago', 
      tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
      type: TransactionType.MintPosition, 
      token0: {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
      token1: {chainId: 1, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'},
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  }
]