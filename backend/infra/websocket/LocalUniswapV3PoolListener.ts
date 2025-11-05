import { PublicClient } from 'viem'
import { PoolInfo } from '../types/TypesInInfra';
import logger from '../../helpers/logger';
import { fetchPoolInfo } from '../utils/Pool';

class LocalUniswapV3PoolListener {
    private poolAddress!:`0x${string}`;
    private wssURL !:string;
    private publicClient!: PublicClient;
    private POLL_INTERVAL = 12000;
    private interval !:NodeJS.Timeout | null;
    private latestPooInfo?:PoolInfo | undefined = undefined

    private pollSwapEvents = async () =>{ 
        logger.info('Start fetching pool info from local...')
        const poolInfo = await fetchPoolInfo(this.poolAddress, this.publicClient)
        this.latestPooInfo = poolInfo
    }
    constructor(poolAddress: `0x${string}`, wssURL: string, publicClient: PublicClient) {
        this.poolAddress = poolAddress;
        this.wssURL = wssURL;
        this.publicClient = publicClient;
        this.initPoll();
    }

    private initPoll(): void {
        logger.info(`Create a local poll for pool ${this.poolAddress} via wss ${this.wssURL}`);
        this.interval = setInterval(this.pollSwapEvents, this.POLL_INTERVAL)
    }

    public getLatestPooInfo(): PoolInfo | undefined {
        return this.latestPooInfo
    }

    public disconnect(): void {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = null
        }
    }
}

export default LocalUniswapV3PoolListener

