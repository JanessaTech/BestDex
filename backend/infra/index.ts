import redisClient from './redis/RedisClient'
import webSocketClient from './websocket/WebSocketClient'

redisClient.init()
webSocketClient.init()

export {redisClient, webSocketClient}