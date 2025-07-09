export type TokenType = {
    chainId: number;
    name: string;
    symbol: string;
    decimal: number;
    alias: string;
    address: string;
    company?: string
}
export type TokenListType = {chainId: number, tokens: TokenType[]}[]

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