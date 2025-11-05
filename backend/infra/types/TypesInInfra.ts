import { ethers} from 'ethers'

export type PoolInfo = {
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    slot0: any[];
    sqrtPriceX96: ethers.BigNumber;
    tick: number;
    liquidity: ethers.BigNumber;
    timeStamp: number;
}