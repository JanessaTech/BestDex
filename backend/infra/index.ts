import redisClient from './redis/RedisClient'
import webSocketClient from './websocket/WebSocketClient'
//import subGraphClient from './subgraph/SubGraphClient'
import liveQueryClient from './subgraph/LiveQueryClient'

redisClient.init()
webSocketClient.init()
//subGraphClient.init()
liveQueryClient.init()

export {redisClient, webSocketClient, liveQueryClient}