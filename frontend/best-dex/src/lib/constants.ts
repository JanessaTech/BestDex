import type { NetworkType, TokenType} from "./types"


export const defaultNetwork: NetworkType =  {chainId: 1, name: 'ethereum', label: 'Ethereum'}
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
        {chainId: 1, name: 'eth', symbol: 'ETH', company: 'Ethereum', address: '0x000'},
        {chainId: 1, name: 'dai', symbol: 'DAI', company: 'Dai', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F'},
        {chainId: 1, name: 'usdc', symbol: 'USDC', company: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'},
        {chainId: 1, name: 'weth', symbol: 'WETH', company: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
        {chainId: 1, name: 'usdt', symbol: 'USDT', company: 'Teher', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'},
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


