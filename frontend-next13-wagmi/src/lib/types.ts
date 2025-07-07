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