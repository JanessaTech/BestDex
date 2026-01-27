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
    //slot0: any[];
    sqrtPriceX96: string;
    tick: number;
    liquidity: string;
    timeStamp: number;
}

//config
export const NETWORK_CONSTANTS = {
    MAINNET: ['eth-mainnet', 'arb-mainnet', 'bnb-mainnet', 'base-mainnet'] as const,
    TESTNET: ['eth-sepolia', 'base-sepolia', 'arb-sepolia'] as const,
    LOCAL: ['localhost'] as const
} as const
export type MAINNET_ENUM = typeof NETWORK_CONSTANTS.MAINNET[number]
type TESTNET_ENUM = typeof NETWORK_CONSTANTS.TESTNET[number]
type LOCALNET_ENUM = typeof NETWORK_CONSTANTS.LOCAL[number]
export type NETWORK_ENUM = MAINNET_ENUM | TESTNET_ENUM | LOCALNET_ENUM;

export type ConfiguredTokens = {chainId: number, network_enum: NETWORK_ENUM, tokens: TokenType[]}
export type ConfiguredFeeTier = {value: number, description: string}

