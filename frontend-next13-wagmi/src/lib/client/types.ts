import { TokenType } from "@/common/types";

export type DexResponseType<T = any> = {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    errors?: any
}

export type PaginationReturnType<T> = {
    results: T,
    page: number,
    pageSize: number,
    totalPages: number,
    totalResults: number,
}

// transaction
export type TransactionCreateInputType = {
    chainId: number;
    tokenId?: string;
    tx: `0x${string}`;
    token0: `0x${string}`;
    token1: `0x${string}`;
    txType: string;
    amount0: string;
    amount1: string;
    usd: string;
    from: string;
}

export type TransactionInfoType = {
    id: number;
    chainId: number;
    tokenId: string;
    tx: string;
    token0: TokenType;
    token1: TokenType;
    txType: string;
    amount0: string;
    amount1: string;
    usd: string;
    from: string;
    createdAt: Date;
}

//pool
export type PoolInfo = {
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    slot0: any[];
    sqrtPriceX96: string;
    tick: number;
    liquidity: string;
    timeStamp: number;
}

//config
export type Network_Enum = 'eth-mainnet' | 'arb-mainnet' | 'bnb-mainnet' | 'polygon-mainnet' | 'localhost' | 'testnet'
export type ConfiguredTokens = {chainId: number, network_enum: Network_Enum, tokens: TokenType[]}
export type ConfiguredFeeTier = {value: number, description: string}

