import express from 'express'
import initWebSocketErrorHandlers from './IniWebSocketHandlers'
import controller from '../../controllers/WebSocketController'

const router = express.Router()
router.get('/status', controller.getStatus)

initWebSocketErrorHandlers(router)

export default router