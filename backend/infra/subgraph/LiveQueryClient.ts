import getConfig from "../../config/configuration";
import { PoolClient } from "../pool/PoolClient"
import { ChainConfig, ChainMonitor } from "./ChainMonitor";
import { MonitorConfig, MultiChainMonitor } from "./MultiChainMonitor";

interface LiveQueryClientConfig {}
class LiveQueryClient {
    private config: LiveQueryClientConfig;
    private poolClient: PoolClient
    private multiChainMonitor!: MultiChainMonitor

    constructor(_config: LiveQueryClientConfig, _poolClient: PoolClient) {
        this.config = _config
        this.poolClient = _poolClient
        this.poolClient.on('ready', async () => {
            await this.startMultiChainMonitor()
        })
    }

    public init() {}

    private async startMultiChainMonitor() {
        const monitorConfig: MonitorConfig = {configs: []}

        if (this.poolClient.poolAddressMap.get(1)) {
            const ethereumPoolIds = Array.from(this.poolClient.poolAddressMap.get(1)!.keys())
            //console.log('ethereumPoolIds=', ethereumPoolIds)
            const ethereumChainConfig: ChainConfig = {
                chainName: 'ethereum',
                chainId: 1,
                enabled: true,
                graphClientDir:'../graphclient/ethereum/.graphclient',
                queryName: 'GetMultipleEthereumPoolLiveData',
                poolIds: ethereumPoolIds,
                maxRetries: 5,
                retryInterval: 10
            }
            monitorConfig.configs.push(ethereumChainConfig)
        }

        if (this.poolClient.poolAddressMap.get(11155111)) {
            const ethereumSepoliaPoolIds = Array.from(this.poolClient.poolAddressMap.get(11155111)!.keys())
            const ethereumSepoliaChainConfig: ChainConfig = {
                chainName: 'ethereum_sepolia',
                chainId: 11155111,
                enabled: false,
                graphClientDir:'../graphclient/ethereum_sepolia/.graphclient',
                queryName: 'GetMultipleEthereumSepoliaPoolLiveData',
                poolIds: ethereumSepoliaPoolIds,
                maxRetries: 5,
                retryInterval: 10
            }
            monitorConfig.configs.push(ethereumSepoliaChainConfig)
        }
        this.multiChainMonitor = new MultiChainMonitor(monitorConfig, this.poolClient)
        await this.multiChainMonitor.start()
    }

    public async start() {
        await this.multiChainMonitor.start()
    }

    public async stop() {
        await this.multiChainMonitor.stop()
    }

    public getLatestPoolInfo(chainId: number, poolAddress: string) {
        return this.multiChainMonitor.getLatestPoolInfo(chainId, poolAddress)
    }

    public getStatus(chainName: string) {
        return this.multiChainMonitor.getStatus(chainName)
    }

    public getAllStatuses() {
        return this.multiChainMonitor.getAllStatuses()
    } 

}

const poolClient = new PoolClient()
const liveConfig: LiveQueryClientConfig = {}
const liveQueryClient = new LiveQueryClient(liveConfig, poolClient)

const config = getConfig()
if (config.env !== 'local') {
    poolClient.init()
}

export default liveQueryClient