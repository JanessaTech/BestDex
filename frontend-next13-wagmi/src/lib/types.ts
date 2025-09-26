export type TokenType = {
    chainId: number;
    name: string;
    symbol: string;
    decimal: number;
    alias: string;
    address: `0x${string}`;
    company?: string;
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
    slippage: number;
    deadline: number;
    amountIn: number;
    tokenIn: TokenType;
    tokenOut: TokenType;
}

export type LocalChainIds = 31337

export type MintPositionParamsType = {
    token0: `0x${string}`, 
    token1: `0x${string}`, 
    recipient: `0x${string}`, 
    fee: number, 
    tickLower: number, 
    tickUpper: number, 
    amount0Min: bigint, 
    amount1Min: bigint, 
    amount0Desired: bigint, 
    amount1Desired: bigint, 
    deadline: bigint}

export type PositionProps = {
    id: number,
    token0: TokenType,
    token1: TokenType,
    lowerTick: number,
    upperTick: number,
    liquidity: number,
    status: boolean,
    fee: number,
    wallet: string
}