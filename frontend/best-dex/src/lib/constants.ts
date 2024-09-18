import type {TokenType} from "./types"
import {TransactionType} from "./types"
import { NetworkType } from "./atoms"

export const networks: readonly NetworkType[] = [
    {chainId: 1, name: 'ethereum', label: 'Ethereum'},
    {chainId: 42161, name: 'arbitrum', label: 'Arbitrum'},
    {chainId: 10, name: 'optimism', label: 'Optimism'},
    {chainId: 137, name: 'polygon', label: 'Polygon'},
    {chainId: 8453, name: 'base', label: 'Base'},
    {chainId: 56, name: 'bnb', label: 'BNB Chain'},
    {chainId: 43114, name: 'avalanche', label: 'Avalanche'}
]
type TokenListProps = {
    recommended?: TokenType[],
    popular?: TokenType[],
    searched?: TokenType[]
}
export const TokenListData: TokenListProps = {
    recommended: [
        {chainId: 1, name: 'eth', symbol: 'ETH', company: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        {chainId: 1, name: 'dai', symbol: 'DAI', company: 'Dai', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F'},
        {chainId: 1, name: 'usdc', symbol: 'USDC', company: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'},
        {chainId: 1, name: 'weth', symbol: 'WETH', company: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        {chainId: 1, name: 'wbtc', symbol: 'WBTC', company: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'}
    ],
    popular: [
        {chainId: 1, name: '0x', symbol: 'ZRX', company: '0x Protocal', address: '0xe41d2489571d322189246dafa5ebde1f4699f498'},
        {chainId: 1, name: '1inch', symbol: '1INCH', company: '1inch', address: '0x111111111117dc0aa78b770fa6a738034120c302'},
    ],
    searched: [
        {chainId: 1, name: 'aave', symbol: 'AAVE', company: 'Aave', address: '0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9'},
        {chainId: 1, name: 'aioz', symbol: 'AIOZ', company: 'AIOZ Network', address: '0x626E8036dEB333b408Be468F951bdB42433cBF18'}
    ]
}

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
        token0:{chainId: 1, name: 'eth', symbol: 'ETH', company: 'ethereum', address:'111'},
        token1: {chainId: 1, name: 'usdt', symbol: 'USDT', company: 'USDT', address:'222'},
        lowTick: 12456,
        highTick: 456787,
        liquidity: 758845612347588,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: 'wbtc', symbol: 'WBTC', company: 'WBTC', address:'111'},
        token1: {chainId: 1, name: 'weth', symbol: 'WETH', company: 'WETH', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: '0x', symbol: 'ZRX', company: 'ZRX', address:'1111'},
        token1: {chainId: 1, name: 'aave', symbol: 'AIOZ', company: 'AIOZ', address:'2222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 3333333, 
        token0:{chainId: 1, name: '0x', symbol: 'ZRX', company: 'ZRX', address:'111'},
        token1: {chainId: 1, name: 'aave', symbol: 'AIOZ', company: 'AIOZ', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 44444444, 
        token0:{chainId: 1, name: '0x', symbol: 'ZRX', company: 'ZRX', address:'111'},
        token1: {chainId: 1, name: 'aave', symbol: 'AIOZ', company: 'AIOZ', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 11111111, 
        token0:{chainId: 1, name: 'eth', symbol: 'ETH', company: 'ethereum', address:'111'},
        token1: {chainId: 1, name: 'usdt', symbol: 'USDT', company: 'USDT', address:'2222'},
        lowTick: 12456,
        highTick: 456787,
        liquidity: 758845612347588,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: 'wbtc', symbol: 'WBTC', company: 'WBTC', address:'111'},
        token1: {chainId: 1, name: 'weth', symbol: 'WETH', company: 'WETH', address:'222'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: true,
        fee: 0.03,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 222222, 
        token0:{chainId: 1, name: '0x', symbol: 'ZRX', company: 'ZRX', address:'33'},
        token1: {chainId: 1, name: 'aave', symbol: 'AIOZ', company: 'AIOZ', address:'444'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 3333333, 
        token0:{chainId: 1, name: '0x', symbol: 'ZRX', company: 'ZRX', address:'222'},
        token1: {chainId: 1, name: 'aave', symbol: 'AIOZ', company: 'AIOZ', address:'3333'},
        lowTick: 45661,
        highTick: 986564,
        liquidity: 8956471235467,
        status: false,
        fee: 1.0,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        id: 44444444, 
        token0:{chainId: 1, name: '0x', symbol: 'ZRX', company: 'ZRX', address:'222'},
        token1: {chainId: 1, name: 'aave', symbol: 'AIOZ', company: 'AIOZ', address:'3333'},
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
        token0:{chainId: 1, name: 'wbtc', symbol: 'WBTC', company: 'WBTC', address:'111'},
        token1: {chainId: 1, name: 'weth', symbol: 'WETH', company: 'WETH', address:'222'},
        token0Amount: 0.44,
        token1Amount: 12.78,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        time: '1 day ago', 
        tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
        type: TransactionType.BurnPosition, 
        token0:{chainId: 1, name: 'eth', symbol: 'ETH', company: 'ethereum', address:'111'},
        token1: {chainId: 1, name: 'usdt', symbol: 'USDT', company: 'USDT', address:'2222'},
        token0Amount: 0.44,
        token1Amount: 12.78,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        time: '2 days ago', 
        tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
        type: TransactionType.AddLiquidity, 
        token0:{chainId: 1, name: 'eth', symbol: 'ETH', company: 'ethereum', address:'111'},
        token1: {chainId: 1, name: 'usdt', symbol: 'USDT', company: 'USDT', address:'2222'},
        token0Amount: 0.44,
        token1Amount: 12.78,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    },
    {
        time: '3 days ago', 
        tx: '0xF74216B5D2bD226B08766E5274dd137232524224',
        type: TransactionType.MintPosition, 
        token0:{chainId: 1, name: 'eth', symbol: 'ETH', company: 'ethereum', address:'111'},
        token1: {chainId: 1, name: 'usdt', symbol: 'USDT', company: 'USDT', address:'2222'},
        token0Amount: 0.44,
        token1Amount: 12.78,
        wallet: '0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536'
    }
]

type BalanceProps = {
    token: TokenType,
    balance: number,
    price: number,
    total: number
}

export const BalanceListData: BalanceProps[] = [
    { 
        token: {chainId: 1, name: 'eth', symbol: 'ETH', company: 'ethereum', address:'111'},
        balance: 123,
        price: 23,
        total:23155
    },
    { 
        token: {chainId: 1, name: 'dai', symbol: 'DAI', company: 'DAI', address:'222'},
        balance: 123,
        price: 23,
        total:23155
    },
    { 
        token:{chainId: 1, name: 'usdt', symbol: 'USDT', company: 'USDT', address:'2222'},
        balance: 123,
        price: 23,
        total:23155
    },
    { 
        token:{chainId: 1, name: 'usdc', symbol: 'USDC', company: 'USDC', address:'2222'},
        balance: 123,
        price: 23,
        total:23155
    }
]


