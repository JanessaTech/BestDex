import { PublicClient } from 'viem'
import logger from '../../helpers/logger';
import { fetchPoolInfo } from '../utils/Pool';
import { CHANNELS, LISTENER_lOCAL_POLL_INTERVAL } from '../../helpers/common/constants';
import { PoolInfo } from '../types';
import { AppType } from '../../helpers/types/Types';
import { WebsocketServer } from './WebsocketServer';

class LocalUniswapV3PoolListener {
    private poolAddress!:`0x${string}`;
    private wssURL !:string;
    private publicClient!: PublicClient;
    private POLL_INTERVAL = LISTENER_lOCAL_POLL_INTERVAL;
    private interval !:NodeJS.Timeout | null;
    private latestPooInfo?:PoolInfo | undefined = undefined
    private app!: AppType
    private websocketServer!: WebsocketServer

    private pollSwapEvents = async () =>{ 
        await this.fetchPoolData(); 
    }

    private fetchPoolData = async () => {
        try {
            logger.info(`Start fetching pool info from ${this.poolAddress} for chainId ${await this.publicClient.getChainId()}`)
            const poolInfo = await fetchPoolInfo(this.poolAddress, this.publicClient)
            const chainId = await this.publicClient.getChainId()
            this.broadcastToChannel(chainId, this.poolAddress, poolInfo)
            this.latestPooInfo = poolInfo
        } catch(error) {
            logger.error('failed to fetch pool data due to: ', error)
        }
    }

    private broadcastToChannel(chainId: number, poolAddress: `0x${string}`, poolInfo: PoolInfo) {
        try {
            const sentCnt = this.websocketServer.broadcastToChannel(CHANNELS.POOLINFO, {chainId, poolAddress, poolInfo})
            logger.debug(`${sentCnt} copies of poolInfo were sent to frontend`)
        } catch(error) {
            logger.error('Failed to broadcast the latest poolInfo to frontend due to:', error)
        }
        
    }

    constructor(poolAddress: `0x${string}`, wssURL: string, publicClient: PublicClient, _app: AppType) {
        this.poolAddress = poolAddress;
        this.wssURL = wssURL;
        this.publicClient = publicClient;
        this.app = _app;
        this.websocketServer = _app.get('websocketServer')
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

