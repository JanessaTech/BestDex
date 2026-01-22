export type MessageType = {
    [key: string]: string
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

export type PoolRange = {
    min: number;
    max: number;
    currentTick: number;
    lower: number;
    upper: number;
}

export enum TRANSACTION_TYPE {
    Swap = 'Swap',
    Mint = 'Mint',
    Increase = 'Increase',
    Decrease = 'Decrease',
    Collect = 'Collect'
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

export type SwapParamsType = {
    deadline: bigint;
    innerCalls: readonly `0x${string}`[]
}

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
    deadline: bigint
}
export type IncreasePositionParamsType = {
    tokenId: bigint,
    amount0Desired: bigint,
    amount1Desired: bigint,
    amount0Min: bigint,
    amount1Min: bigint,
    deadline: bigint
}

export type CollectFeeParamsType = {
    tokenId: bigint,
    recipient: `0x${string}`, 
    amount0Max: bigint,
    amount1Max: bigint,
}

export type PositionProps = {
    tokenId: string,
    token0: TokenType,
    token1: TokenType,
    tickLower: number,
    tickUpper: number,
    liquidity: bigint,
    fee: number,
    owner: string
}