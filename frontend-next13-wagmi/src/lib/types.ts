export type TokenType = {
    chainId: number;
    name: string;
    symbol: string;
    decimal: number;
    alias: string;
    address: string;
    company?: string
}
export type Network_Enum = 'eth-mainnet' | 'arb-mainnet' | 'bnb-mainnet' | 'polygon-mainnet' | 'localhost' | 'testnet'
export type TokenListType = {chainId: number, network_enum: Network_Enum, tokens: TokenType[]}[]

export enum TransactionType {
    Swap,
    BurnPosition,
    AddLiquidity,
    MintPosition
}

export type QuotesParameterType = {
    chainId: number;
    rpcUrl: string;
    recipient: `0x${string}`;
    slippage: number,
    deadline: number,
    amountIn: number,
    tokenIn: TokenType,
    tokenOut: TokenType
}