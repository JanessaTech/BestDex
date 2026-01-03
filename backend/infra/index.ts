import redisClient from './redis/RedisClient'
import webSocketClient from './websocket/WebSocketClient'
import liveQueryClient from './subgraph/LiveQueryClient'
import getConfig from '../config/configuration'

const config = getConfig()

redisClient.init()
if (config?.env === 'local') {
    webSocketClient.init()
} else {
    liveQueryClient.init()
}

export {redisClient, webSocketClient, liveQueryClient}