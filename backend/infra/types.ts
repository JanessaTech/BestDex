import UniswapV3PoolListener from './websocket/UniswapV3PoolListener';
import LocalUniswapV3PoolListener from './websocket/LocalUniswapV3PoolListener';

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

export type TokenType = {
    chainId: number;
    name: string;
    symbol: string;
    decimal: number;
    alias: string;
    address: `0x${string}`;
    company?: string;
}

export type PoolMetaData = {
    listener: UniswapV3PoolListener| LocalUniswapV3PoolListener;
    token0 : TokenType;
    token1: TokenType;
    feeAmount: number
}