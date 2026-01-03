import EventEmitter from "events";
import { ChainConfig, ChainMonitor } from "./ChainMonitor";
import logger from "../../helpers/logger";

export interface MonitorConfig {
    configs: ChainConfig[]
}

export class MultiChainMonitor extends EventEmitter {
    private mconfig: MonitorConfig
    private monitorMap: Map<string, ChainMonitor>
    private isRunning: boolean

    constructor(_mconfig: MonitorConfig) {
        super()
        this.mconfig = _mconfig
        this.monitorMap = new Map()
        this.isRunning = false
        this.init()
    }

    private init() {
        logger.info(`Init MultiChainMonitor`)
        let cnt = 0
        for (let config of this.mconfig.configs) {
            if (config.enabled) {
                try {
                    const monitor = new ChainMonitor(config)
                    monitor.on('data', (update) => {
                        logger.info('Received update:', update)
                    })
                    this.monitorMap.set(config.chainName, monitor)
                    cnt++
                } catch(error) {
                    logger.error(`Failed to create monitor for chain ${config.chainName} due to:`, error)
                }
            }
        }
        logger.info(`${cnt} ChainMonitors were created`)
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