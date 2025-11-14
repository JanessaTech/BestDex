import UniswapV3PoolListener from './websocket/UniswapV3PoolListener';
import LocalUniswapV3PoolListener from './websocket/LocalUniswapV3PoolListener';
import { TokenType } from '../controllers/types';

export type PoolMetaData = {
    listener: UniswapV3PoolListener| LocalUniswapV3PoolListener;
    token0 : TokenType;
    token1: TokenType;
    feeAmount: number
}