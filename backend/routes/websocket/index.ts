import express from 'express'
import initWebSocketErrorHandlers from './IniWebSocketHandlers'
import controller from '../../controllers/WebSocketController'
import { validate } from '../../middlewares'
import websocketSchema from '../schemas/websocket'

const router = express.Router()
router.get('/status',  controller.getStatus)
router.post('/broadcast', validate(websocketSchema.broadcast), controller.broadcast)
router.post('/sendTo', validate(websocketSchema.sendTo), controller.sendTo)

initWebSocketErrorHandlers(router)

export default router