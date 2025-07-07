import type { TokenListType, TokenType } from "./types"
import  {  TransactionType } from "./types"

export const tokenList: TokenListType = [
    {
      chainId: 1,  
      tokens: [
        {chainId: 1, name: 'usdt', label: 'USDT', address: '1111'}, 
        {chainId: 1, name: 'weth', label: 'WETH', address: '2222'}
      ]
    },
    {
      chainId: 137,  
      tokens: [
        {chainId: 137, name: 'pol', label: 'POL', address: '3333'}, 
        {chainId: 137, name: 'weth', label: 'WETH', address: '4444'},
        {chainId: 137, name: 'usdt', label: 'USDT', address: '5555'}
      ]
    },
    {
      chainId: 42161,  
      tokens: [
        {chainId: 42161, name: 'dai', label: 'DAI', address: '666'}, 
        {chainId: 42161, name: 'wbtc', label: 'WBTC', address: '777'},
        {chainId: 42161, name: '1inch', label: '1INCH', address: '888'}
      ]
    },
    {
      chainId: 11155111,  
      tokens: []
    },
    {
      chainId: 31337,  
      tokens: []
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
        token0:{chainId: 1, name: 'eth', label: 'ETH', company: 'ethereum', address:'111'},
        token1: {chainId: 1, name: 'usdt', label: 'USDT', company: 'USDT', address:'222'},
        lowTick: 12456,
        highTick: 456787,
        liquidity: 758845612347588,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: 'wbtc', label: 'WBTC', company: 'WBTC', address:'111'},
        token1: {chainId: 1, name: 'weth', label: 'WETH', company: 'WETH', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: '0x', label: 'ZRX', company: 'ZRX', address:'1111'},
        token1: {chainId: 1, name: 'aave', label: 'AIOZ', company: 'AIOZ', address:'2222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 3333333, 
        token0:{chainId: 1, name: '0x', label: 'ZRX', company: 'ZRX', address:'111'},
        token1: {chainId: 1, name: 'aave', label: 'AIOZ', company: 'AIOZ', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 44444444, 
        token0:{chainId: 1, name: '0x', label: 'ZRX', company: 'ZRX', address:'111'},
        token1: {chainId: 1, name: 'aave', label: 'AIOZ', company: 'AIOZ', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 11111111, 
        token0:{chainId: 1, name: 'eth', label: 'ETH', company: 'ethereum', address:'111'},
        token1: {chainId: 1, name: 'usdt', label: 'USDT', company: 'USDT', address:'2222'},
        lowTick: 12456,
        highTick: 456787,
        liquidity: 758845612347588,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: 'wbtc', label: 'WBTC', company: 'WBTC', address:'111'},
        token1: {chainId: 1, name: 'weth', label: 'WETH', company: 'WETH', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: '0x', label: 'ZRX', company: 'ZRX', address:'33'},
        token1: {chainId: 1, name: 'aave', label: 'AIOZ', company: 'AIOZ', address:'444'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 3333333, 
        token0:{chainId: 1, name: '0x', label: 'ZRX', company: 'ZRX', address:'222'},
        token1: {chainId: 1, name: 'aave', label: 'AIOZ', company: 'AIOZ', address:'3333'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 44444444, 
        token0:{chainId: 1, name: '0x', label: 'ZRX', company: 'ZRX', address:'222'},
        token1: {chainId: 1, name: 'aave', label: 'AIOZ', company: 'AIOZ', address:'3333'},
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
      token0:{chainId: 1, name: 'wbtc', label: 'WBTC', company: 'WBTC', address:'111'},
      token1: {chainId: 1, name: 'weth', label: 'WETH', company: 'WETH', address:'222'},
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  },
  {
      time: '1 day ago', 
      tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
      type: TransactionType.BurnPosition, 
      token0:{chainId: 1, name: 'eth', label: 'ETH', company: 'ethereum', address:'111'},
      token1: {chainId: 1, name: 'usdt', label: 'USDT', company: 'USDT', address:'2222'},
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  },
  {
      time: '2 days ago', 
      tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
      type: TransactionType.AddLiquidity, 
      token0:{chainId: 1, name: 'eth', label: 'ETH', company: 'ethereum', address:'111'},
      token1: {chainId: 1, name: 'usdt', label: 'USDT', company: 'USDT', address:'2222'},
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  },
  {
      time: '3 days ago', 
      tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
      type: TransactionType.MintPosition, 
      token0:{chainId: 1, name: 'eth', label: 'ETH', company: 'ethereum', address:'111'},
      token1: {chainId: 1, name: 'usdt', label: 'USDT', company: 'USDT', address:'2222'},
      token0Amount: 0.44,
      token1Amount: 12.78,
      wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
  }
]