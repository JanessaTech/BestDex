import UniswapV3PoolListener from './websocket/UniswapV3PoolListener';
import LocalUniswapV3PoolListener from './websocket/LocalUniswapV3PoolListener';
import { TokenType } from '../controllers/types';

export type PoolMetaData = {
    listener: UniswapV3PoolListener| LocalUniswapV3PoolListener;
    token0 : TokenType;
    token1: TokenType;
    feeAmount: number
}

//pool
export type PoolInfo = {
    token0: string;
    token1: string;
    liquidity: string;
    tick: number;
    sqrtPriceX96: string;
    tickSpacing: number;
    fee: number;
    //slot0?: any[];
    timeStamp: number;
}