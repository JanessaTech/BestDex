// pagination
export type PaginationOptionType = {
    sortBy?: string,
    populate?: string,
    pageSize: number,
    page: number
}
export type PaginationReturnType = {
  results: any,
  page: number,
  pageSize: number,
  totalPages: number,
  totalResults: number,
}

// For Account
export type LoginInPutType = {
    name: string,
    password: string
}
export type AccountInfoType = {
    id?: string,
    name: string,
    password: string,
    roles: string[],
    email: string, 
    token?: string
}

//For user
export type UserRegisterInputType = {
    name: string,
    profile?: string,
    address: string,
    intro?: string
}

export type UserUpdateInputType = {
    id?: number,
    name?: string,
    profile?: string,
    intro?: string
}

export type TokenType = {
    chainId: number;
    name: string;
    symbol: string;
    decimal: number;
    alias: string;
    address: `0x${string}`;
    company?: string;
}



//position
export type PositionProps = {
    tokenId: string;
    tickLower: number;
    tickUpper: number;
    liquidity: string;
    token0: TokenType;
    token1: TokenType;
    owner: `0x${string}`;
    fee: number
}

// transaction
export type TransactionCreateInputType = {
    chainId: number;
    tokenId?: string;
    tx: string;
    token0: string;
    token1: string;
    txType: string;
    amount0: string;
    amount1: string;
    usd: string;
    from: string;
}

export type TransactionInfoType = {
    id: number;
    chainId: number;
    tokenId?: string;
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

export type TokenListType = {chainId: number, network_enum: NETWORK_ENUM, tokens: TokenType[]}[]