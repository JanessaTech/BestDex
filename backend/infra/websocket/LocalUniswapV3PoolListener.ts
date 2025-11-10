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
        await this.fetchPoolData(); 
    }

    private fetchPoolData = async () => {
        try {
            logger.info(`Start fetching pool info from ${this.poolAddress} for chainId ${await this.publicClient.getChainId()}`)
            const poolInfo = await fetchPoolInfo(this.poolAddress, this.publicClient)
            this.latestPooInfo = poolInfo
        } catch(error) {
            logger.error('failed to fetch pool data due to: ', error)
        }
    }

    constructor(poolAddress: `0x${string}`, wssURL: string, publicClient: PublicClient) {
        this.poolAddress = poolAddress;
        this.wssURL = wssURL;
        this.publicClient = publicClient;
        this.initPoll();
        this.warmup()
    }

    private initPoll(): void {
        logger.info(`Create a local poll for pool ${this.poolAddress} via wss ${this.wssURL}`);
        this.interval = setInterval(this.pollSwapEvents, this.POLL_INTERVAL)
    }

    private warmup() {
        (async () => {
            logger.debug('run warm up to get poolInfo')
            await this.fetchPoolData()
        })()
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

