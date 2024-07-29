import { NetworkType } from "./types"


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

