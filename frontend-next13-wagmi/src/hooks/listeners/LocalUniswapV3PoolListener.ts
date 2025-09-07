import { PublicClient } from 'viem'
import { PoolInfo, fetchPoolInfo } from '@/lib/tools/pool';

class LocalUniswapV3PoolListener {
    private poolAddress!:`0x${string}`;
    private wssURL !:string;
    private publicClient!: PublicClient;
    private POLL_INTERVAL = 12000;
    private interval !:NodeJS.Timeout | null;
    private latestPooInfo?:PoolInfo | undefined = undefined

    constructor(poolAddress: `0x${string}`, wssURL: string, publicClient: PublicClient) {
        this.poolAddress = poolAddress;
        this.wssURL = wssURL;
        this.publicClient = publicClient;
        this.initPoll();
    }

    private initPoll(): void {
        console.log(`Create a local poll for pool ${this.poolAddress} via wss ${this.wssURL}`);
        this.interval = setInterval(this.pollSwapEvents, this.POLL_INTERVAL)
    }

    private async pollSwapEvents() { 
        console.log('Start fetching pool info from local...')
        const poolInfo = await fetchPoolInfo(this.poolAddress, this.publicClient)
        this.latestPooInfo = poolInfo
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