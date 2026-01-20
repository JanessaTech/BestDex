import { EventEmitter } from "events";
import logger from "../../helpers/logger";

type PoolAttrs = {
    id: string;
    liquidity: string;
    tick:number;
    sqrtPriceX96: string;
    fee: number;
}
export type PoolUpdate  = {
    chainId: number;
    chainName: string;
    timestamp: number;
    pools: PoolAttrs[]
}

export interface ChainConfig {
    chainName: string;
    chainId: number;
    enabled: boolean;
    graphClientDir: string;
    poolIds: string[];
    queryName: string;
    maxRetries: number;
    retryInterval: number; 
}

interface ChainMonitorEvents {
    'data': (update: PoolUpdate) => void;
}

export interface ChainMonitor {
    on<U extends keyof ChainMonitorEvents>(event: U, listener: ChainMonitorEvents[U]): this;
    emit<U extends keyof ChainMonitorEvents>(event: U, ...args: Parameters<ChainMonitorEvents[U]>): boolean
}

export class ChainMonitor extends EventEmitter {
    private config: ChainConfig
    private sdk: any

    private isRunning: boolean
    private stream?: AsyncIterable<any>
    private lastUpdateTime: number = 0

    private retryCount: number = 0
    private retryTimer?: NodeJS.Timeout

    constructor(chainConfig: ChainConfig) {
        super()
        this.config = chainConfig
        this.sdk = this.init()
        this.isRunning = false
    }

    public getName() {
        return this.config.chainName
    }

    private init() {
        try {
            const sdk = require(this.config.graphClientDir)
            logger.info(`[Monitor<${this.config.chainName}>] Created sdk successfully`)
            return sdk.getBuiltGraphSDK ? sdk.getBuiltGraphSDK() : sdk;
        } catch(error) {
            logger.error(`[Monitor<${this.config.chainName}>] Failed to init sdk due to: ${error}`)
            throw new Error(`[Monitor<${this.config.chainName}>] Graph Client not found for chain ${this.config.chainName}. Run g'raphclient build' first`)
        }
    }

    public async start() {
        if (this.isRunning) {
            logger.error(`[Monitor<${this.config.chainName}>] Monitor for ${this.config.chainName} is already running`)
            return
        }
        this.isRunning = true
        logger.info(`[Monitor<${this.config.chainName}>] Start monitor...`)
        try {
            const queryMethod = await this.sdk[this.config.queryName]
            if (!queryMethod || typeof queryMethod !== 'function') {
                throw new Error(`[Monitor<${this.config.chainName}>] Query method ${this.config.queryName} is not found`)
            }
            this.stream = await queryMethod({poolIds: this.config.poolIds}) as AsyncIterable<any>
            await this.processStream()
        } catch (error) {
            await this.handleError(error as Error)
        }

    }

    private async processStream() {
        if (!this.isRunning || !this.stream) {
            logger.error(`[Monitor<${this.config.chainName}>] The monitor is not running or no stream is found`)
            throw new Error('The monitor is not running or no stream is found')
        }
        try {
            //throw Error('test ........')
            for await (const result of this.stream) {
                if (!this.isRunning) {
                    logger.info(`[Monitor<${this.config.chainName}>] Exit stream loop`)
                    break
                }
                const chainKey = `uniswapv3_${this.config.chainName}`
                const poolData = result[chainKey] as any[]
                const timeNow = Date.now()
                const poolUpdate: PoolUpdate = {
                    chainId: this.config.chainId,
                    chainName: this.config.chainName,
                    timestamp: timeNow,
                    pools: poolData.map((e) => ({id: e.id,
                        liquidity: e.liquidity,
                        tick:Number(e.tick),
                        sqrtPriceX96: e.sqrtPrice,
                        fee: Number(e.feeTier)}) 
                    )
                }
                //console.info(`[Monitor<${this.config.chainName}>] poolUpdate=`, poolUpdate)
                this.emit('data', poolUpdate)
                this.lastUpdateTime = timeNow
                this.retryCount = 0
            }
        } catch (error) {
            logger.error(`[Monitor<${this.config.chainName}>] Failed to process stream: ${error}`)
            throw new Error('Failed to process stream')
        }
    }

    private handleError(error: Error) {
        if (this.retryCount >=  this.config.maxRetries) {
            logger.info(`[Monitor<${this.config.chainName}>] Reached the max attempts ${this.config.maxRetries}. Stop!`)
            this.isRunning = false
            this.stream = undefined
            return
        }
        
        if (this.retryTimer) {
            clearTimeout(this.retryTimer)
            this.retryTimer = undefined
        }
        this.retryCount++
        const delay = this.config.retryInterval ** this.retryCount
        logger.info(`[Monitor<${this.config.chainName}>] Handle error (attempt ${this.retryCount}/${this.config.maxRetries}). Delay: ${delay} ms`, error)
        this.retryTimer = setTimeout(async () => {
            await this.stop()
            await this.start()
        }, delay);

    }

    public async stop() {
        this.isRunning = false
        this.stream = undefined
        logger.info(`[Monitor<${this.config.chainName}>] The monitor is stopped`)
    }

    
    public getHealth() {
        const status = {
            lastUpdateTime: this.lastUpdateTime,
            isRunning: this.isRunning,
            retryCount: this.retryCount
        }
        return status
    }
}