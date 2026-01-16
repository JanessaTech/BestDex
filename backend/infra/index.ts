import redisClient from './redis/RedisClient'
import webSocketClient from './websocket/WebSocketClient'
import liveQueryClient from './subgraph/LiveQueryClient'
import getConfig from '../config/configuration'
import { AppType } from '../helpers/types/Types'

const config = getConfig()

const initInfra = (app: AppType) => {
    redisClient.init(app)
    // if (config?.env === 'local') {
    //     webSocketClient.init(app)
    // } else {
    //     liveQueryClient.init(app)
    // }
    // I enable all(local, testnet, mainnet) for the demo purpose
    webSocketClient.init(app)
    liveQueryClient.init(app)
}

export {redisClient, webSocketClient, liveQueryClient}

export default initInfra