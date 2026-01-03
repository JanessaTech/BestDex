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
            // for (let [chainId, subMap] of this.poolClient.poolAddressMap) {
            //     console.log('chainId =', chainId)
            //     for (let [key, value] of subMap) {
            //         console.log(`${key} = ${value}`)
            //     }
            // }
            await this.startMultiChainMonitor()
        })
    }

    public init() {}

    private async startMultiChainMonitor() {
        const monitorConfig: MonitorConfig = {configs: []}

        if (this.poolClient.poolAddressMap.get(1)) {
            const ethereumPoolIds = Array.from(this.poolClient.poolAddressMap.get(1)!.values())
            //console.log('ethereumPoolIds=', ethereumPoolIds)
            const ethereumChainConfig: ChainConfig = {
                chainName: 'ethereum',
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
            const ethereumSepoliaPoolIds = Array.from(this.poolClient.poolAddressMap.get(11155111)!.values())
            const ethereumSepoliaChainConfig: ChainConfig = {
                chainName: 'ethereum_sepolia',
                enabled: true,
                graphClientDir:'../graphclient/ethereum_sepolia/.graphclient',
                queryName: 'GetMultipleEthereumSepoliaPoolLiveData',
                poolIds: ethereumSepoliaPoolIds,
                maxRetries: 5,
                retryInterval: 10
            }
            monitorConfig.configs.push(ethereumSepoliaChainConfig)
        }
        this.multiChainMonitor = new MultiChainMonitor(monitorConfig)
        await this.multiChainMonitor.start()
    }

    public async start() {
        await this.multiChainMonitor.start()
    }

    public async stop() {
        await this.multiChainMonitor.stop()
    }

    public getStatus(chainName: string) {
        return this.multiChainMonitor.getStatus(chainName)
    }

    public getAllStatuses() {
        return this.multiChainMonitor.getAllStatuses()
    } 

}

const poolClient = new PoolClient()
const config: LiveQueryClientConfig = {}
const liveQueryClient = new LiveQueryClient(config, poolClient)
poolClient.init()
export default liveQueryClient