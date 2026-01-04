import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import { sendSuccess } from "../routes/ReponseHandler"
import { WebsocketServer } from "../infra/websocket/WebsocketServer";
import { WebSocketError } from "../routes/websocket/WebSocketErrors";

class WebSocketController {
    async getStatus(req: Request, res: Response, next: NextFunction) {
        const websocketServer: WebsocketServer = req.app.get('websocketServer');
        try {
            const payload = {
                subscriptions:  Array.from(websocketServer.getSubscriptions().entries()).map(([channel, clients]) => ({
                    channel: channel,
                    clients: [...clients].map((client) => ({ws: websocketServer.getWsIdMap().get(client.ws), subscriptionId: client.subscriptionId}))
                })),
                reverseSubscriptions: Array.from(websocketServer.getReverseSubscriptions()).map(([ws, channels]) => ({
                    ws: websocketServer.getWsIdMap().get(ws),
                    channels: Array.from(channels)
                }))
            }
            sendSuccess(res, 'get ws status successfully', payload)
        } catch(error: any) {
            logger.error('Failed to get ws status: ', error)
            next(new WebSocketError({message: `Failed to get ws status due to ${error.message}`}))
        }
    }
}

const controller = new WebSocketController()
export default controller