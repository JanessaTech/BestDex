
import {getBuiltGraphSDK} from '../../.graphclient'
import { FEE_TIERS, tokenList } from '../../config/data/hardcode';
import logger from '../../helpers/logger'
import { PoolClient } from '../pool/PoolClient';
import { createBlockchainClient } from '../utils/Chain';
import { calcPoolAddress } from '../utils/Pool';

interface SubGraphConfig {
    maxReconnectAttempts: number;
    reconnectInterval: number;
}

class SubGraphClient {
    private sdk = getBuiltGraphSDK()
    private poolClient: PoolClient
    private config!: SubGraphConfig
    private connectTimer ?:NodeJS.Timeout;
    private reconnectAttempts : number = 0;

    // private getPoolLiveData = async () => {
    //     logger.info('Fetch pool live data....')
    //     const liveDataStream  = await this.sdk.GetPoolLiveData({poolId: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36'})
    //     try {
    //         for await (const { pools } of liveDataStream) {
    //           console.log(`[${new Date().toISOString()}] update pool data:`, pools?.[0]);
    //           // trigger bussiness codes
    //         }
    //       } catch (error) {
    //         logger.error('Found error when Polling live pool data. Reconnect.', error);
    //         this.handleReconnect()
    //       }
    // }
    
    constructor(_poolClient: PoolClient) { 
        this.poolClient = _poolClient
        this.poolClient.on('ready', () => {

        })
        logger.debug('constructing subgraph client...')
    }

    public init() {
        //this.connectTimer = setTimeout(this.getPoolLiveData, 100);

        // (async () => {
        //     await this.calculatePoolAddress()
        // })()

    }

    // private handleReconnect(): void {
    //     if(this.reconnectAttempts > this.config.maxReconnectAttempts) {
    //         logger.info(`Reached the max reconnect attempts ${this.config.maxReconnectAttempts}, Stop!`)
    //         return
    //     }
    //     if (this.connectTimer) {
    //         clearTimeout(this.connectTimer)
    //         this.connectTimer = undefined
    //     }
    //     this.reconnectAttempts++
    //     const delay = this.config.reconnectInterval * this.reconnectAttempts
    //     logger.info(`Try to reconnect... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts}). Delay: ${delay} ms`)
    //     this.connectTimer = setTimeout(this.getPoolLiveData, delay);
    // }

    private calculatePoolAddress = async () => {
        const map = new Map<number, string[]>()
        for (let chain of tokenList) {
            const chainId = chain.chainId
            if (chainId === 31337) continue
            map.set(chainId,[])
            const tokens = chain.tokens
            const publicClient = createBlockchainClient(chainId)
            for (let i = 0; i < tokens.length; i++) {
                for (let j = i + 1; j < tokens.length; j++) {
                    const token0 = tokens[i]
                    const token1 = tokens[j]
                    for (let k = 0; k < FEE_TIERS.length; k++) {
                        const feeAmount = FEE_TIERS[k].value * 10000
                        try {
                            const poolAddress = await calcPoolAddress(token0.address, token1.address, feeAmount, chainId, publicClient)
                            map.get(chainId)?.push(poolAddress.toLowerCase())
                            logger.debug(`poolAddress=${poolAddress}, token0=${token0.symbol}, token1=${token1.symbol}, chainId=${chainId} ,feeAmount=${feeAmount}`)
                        } catch(error) {
                            logger.error('poolAddress is invalid due to:', error)
                        }
                        
                    }
                }
            }
        }

        for (let [key, value] of map.entries()) {
            logger.debug('chainId=', key)
            logger.debug(JSON.stringify(value, null, 2))
        }
    }
}

const config: SubGraphConfig = {
    maxReconnectAttempts: 5,
    reconnectInterval: 10
}
const poolClient = new PoolClient()
const subGraphClient = new SubGraphClient(poolClient)
poolClient.init()
export default subGraphClient