import EventEmitter from "events";
import { ChainConfig, ChainMonitor, PoolUpdate } from "./ChainMonitor";
import logger from "../../helpers/logger";
import { PoolClient } from "../pool/PoolClient";
import { getTickSpacing } from "../utils/Pool";
import { ethers } from "ethers";
import { PoolInfo } from "../types";
import { AppType } from "../../helpers/types/Types";
import { WebsocketServer } from "../websocket/WebsocketServer";
import { CHANNELS } from "../../helpers/common/constants";

export type PoolDetails = {
    token0: string;
    token1: string;
    fee: number;
    sqrtPriceX96: string;
    tickSpacing: number,
    tick: number;
    liquidity: string;
    timeStamp: number;
}

export interface MonitorConfig {
    configs: ChainConfig[]
}

export class MultiChainMonitor extends EventEmitter {
    private mconfig: MonitorConfig
    private monitorMap: Map<string, ChainMonitor>
    private isRunning: boolean
    private poolClient: PoolClient
    private app!: AppType
    private websocketServer!: WebsocketServer
    private latestPoolInfoMap = new Map<number, Map<string, PoolInfo>>()

    constructor(_mconfig: MonitorConfig, _poolClient: PoolClient, _app: AppType) {
        super()
        this.mconfig = _mconfig
        this.monitorMap = new Map()
        this.isRunning = false
        this.poolClient = _poolClient
        this.app = _app
        this.websocketServer = _app.get('websocketServer')
        this.init()
    }

    private init() {
        logger.info(`Init MultiChainMonitor`)
        let cnt = 0
        for (let config of this.mconfig.configs) {
            if (config.enabled) {
                try {
                    const monitor = new ChainMonitor(config)
                    monitor.on('data', this.updateLatestPoolInfoMap)
                    this.monitorMap.set(config.chainName, monitor)
                    cnt++
                } catch(error) {
                    logger.error(`Failed to create monitor for chain ${config.chainName} due to:`, error)
                }
            }
        }
        logger.info(`${cnt} ChainMonitors were created`)
    }

    private updateLatestPoolInfoMap = (update: PoolUpdate) => {
        logger.info('Received update:', update)
        const {chainId, timestamp, pools} = update
        if (!this.latestPoolInfoMap.get(chainId)) {
            this.latestPoolInfoMap.set(chainId, new Map())
        }
        for (let pool of pools) {
            const {id, liquidity, tick, sqrtPriceX96, fee} = pool
            const res = this.poolClient.poolAddressMap.get(chainId)!.get(id as `0x${string}`)!
            const poolInfo: PoolInfo = {
                token0: ethers.utils.getAddress(res.token0),
                token1: ethers.utils.getAddress(res.token1),
                liquidity: liquidity,
                tick: tick,
                sqrtPriceX96: sqrtPriceX96,
                tickSpacing: getTickSpacing(fee),
                fee: fee,
                timeStamp: timestamp
            }
            this.broadcastToChannel(chainId, id as `0x${string}`, poolInfo)
            this.latestPoolInfoMap.get(chainId)!.set(id, poolInfo)
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

    public async start() {
        if (this.isRunning) {
            logger.warn('MultiChainMonitor is already started')
            return
        }
        this.isRunning = true
        logger.info('Starting MultiChainMonitor...');
        const startPromises = Array.from(this.monitorMap.values()).map(async (monitor) => {
            try {
                await monitor.start()
                return true
            } catch (error) {
                logger.error(`Failed to start monitor ${monitor.getName()} due to:`, error)
            }
            return false
        })
        const results = await Promise.allSettled(startPromises)
        const startedCnt  = results.filter((r) => r.status === 'fulfilled' && r.value === true).length
        logger.info(`${startedCnt} ChainMonitors were started`)
    }

    public async stop() {
        this.isRunning = false
        const startPromises = Array.from(this.monitorMap.values()).map(async (monitor) => {
            try {
                await monitor.stop()
                return true
            } catch (error) {
                logger.error(`Failed to start monitor ${monitor.getName()} due to:`, error)
            }
            return false
        })
        const results = await Promise.allSettled(startPromises)
        const startedCnt  = results.filter((r) => r.status === 'fulfilled' && r.value === true).length
        logger.info(`${startedCnt} ChainMonitors were stopped`)
    }

    public getLatestPoolInfo(chainId: number, poolAddress: string) {
        return this.latestPoolInfoMap.get(chainId)?.get(poolAddress)
    }

    public getStatus(chainName: string) {
        return this.monitorMap.get(chainName)?.getHealth()
    }

    public getAllStatuses() {
        const statuses: {[P in any]: unknown}  = {}
        for (let [chainName, monitor] of this.monitorMap) {
            const health = monitor.getHealth()
            statuses[chainName] = health
        }
        return statuses
    }
}