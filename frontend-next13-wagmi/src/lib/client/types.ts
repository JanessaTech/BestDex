import { TokenType } from "@/common/types";

export type DexResponseType<T = any> = {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    errors?: any
}

export type TransactionCreateInputType = {
    chainId: number;
    tokenId: string;
    tx: `0x${string}`;
    token0: `0x${string}`;
    token1: `0x${string}`;
    txType: string;
    amount0: string;
    amount1: string;
    usd: string;
    from: string;
}
export type PaginationReturnType<T> = {
    results: T,
    page: number,
    pageSize: number,
    totalPages: number,
    totalResults: number,
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