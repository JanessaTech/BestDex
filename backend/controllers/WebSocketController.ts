import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import { sendSuccess } from "../routes/ReponseHandler"
import { WebsocketServer } from "../infra/websocket/WebsocketServer";
import { WebSocketError } from "../routes/websocket/WebSocketErrors";
import messageHelper from "../helpers/internationalization/messageHelper"

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
            sendSuccess(res, messageHelper.getMessage('ws_status_get_success'), payload)
        } catch(error: any) {
            logger.error('Failed to get ws status: ', error)
            next(new WebSocketError({key: 'ws_status_get_failed', params: [error?.message]}))
        }
    }

    async broadcast(req: Request, res: Response, next: NextFunction) {
        const websocketServer: WebsocketServer = req.app.get('websocketServer');
        const {channel, message} = req.query
        try {
            
            const sentCnt = websocketServer.broadcastToChannel(channel as string, message)
            const payload = {
                channel: channel,
                message: message,
                sentCnt: sentCnt
            }
            sendSuccess(res, messageHelper.getMessage('ws_broadcast_success', channel), payload)
        } catch(error : any) {
            logger.error('Failed to broadcast message:', error)
            next(new WebSocketError({key: 'ws_broadcast_failed', params: [channel, error?.message]}))
        }
    }

    async sendTo(req: Request, res: Response, next: NextFunction) {
        const websocketServer: WebsocketServer = req.app.get('websocketServer')
        const {channel, subscriptionId, message} = req.query
        try {
            
            websocketServer.sendToChannel(channel as string, subscriptionId as string, message)
            const payload = {
                channel: channel,
                subscriptionId: subscriptionId,
                message: message
            }
            sendSuccess(res, messageHelper.getMessage('ws_sendto_success', channel, subscriptionId), payload)
        } catch (error:any) {
            logger.error(`Failed to send message from channel ${channel} to fronetend with subscriptionId ${subscriptionId} due to ${error}`)
            next(new WebSocketError({key: 'ws_sendto_failed', params: [channel, subscriptionId, error?.message]}))
        }
    }
}

const controller = new WebSocketController()
export default controller