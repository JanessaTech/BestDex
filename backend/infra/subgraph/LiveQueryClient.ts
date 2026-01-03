import { PoolClient } from "../pool/PoolClient"

interface LiveQueryClientConfig {

}
class LiveQueryClient {
    private config: LiveQueryClientConfig;
    private poolClient: PoolClient

    constructor(_config: LiveQueryClientConfig, _poolClient: PoolClient) {
        this.config = _config
        this.poolClient = _poolClient
        this.poolClient.on('ready', () => {
            for (let [chainId, subMap] of poolClient.poolAddressMap) {
                console.log('chainId =', chainId)
                for (let [key, value] of subMap) {
                    console.log(`${key} = ${value}`)
                }
            }
        })
    }

    public init() {

    }

}

const poolClient = new PoolClient()
const config: LiveQueryClientConfig = {}
const liveQueryClient = new LiveQueryClient(config, poolClient)
poolClient.init()
export default liveQueryClient