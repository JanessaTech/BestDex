import { Server } from "http"
import WebSocket, { WebSocketServer } from "ws";
import logger from "../../helpers/logger";


export class WebsocketServer {
    private subscriptions  = new Map<string, Set<{ws: WebSocket, subscriptionId: string}>>()
    private reverseSubscriptions = new Map<WebSocket, Set<string>>()
    private wsIdMap = new Map<WebSocket, string>()

    private wss: WebSocketServer;

    constructor(server: Server)  {
        this.wss = new WebSocket.Server({server})
        this.setupWebSocketServer()
        logger.info('A websocket server is ready')
    }

    private setupWebSocketServer(): void {
        this.wss.on('connection', (ws: WebSocket) => {
            // generate an ID for each ws
            const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
            this.wsIdMap.set(ws, connectionId)
            logger.info(`A client with id ${this.wsIdMap.get(ws)} is connected`)
            
            ws.on('message', (data: Buffer) => {
                try {
                    const message = JSON.parse(data.toString())
                    logger.debug('message received:', message)
                    this.handleMessage(ws, message)
                } catch(error) {
                    logger.error('failed to parse message', error)
                }
            })
        
            ws.on('close', () => {
                logger.info(`A client with id ${this.wsIdMap.get(ws)} is disconnected`)
                const channels = this.reverseSubscriptions.get(ws)
                if (channels) {
                    channels.forEach((channel) => {
                        const clients = this.subscriptions.get(channel)
                        if (clients) {
                            for (let client of clients) {
                                if (this.wsIdMap.get(ws) && this.wsIdMap.get(ws) === this.wsIdMap.get(client.ws)) {
                                    clients.delete(client)
                                }
                            }
                            if (clients.size === 0) {
                                this.subscriptions.delete(channel)
                            }
                        }
                    })
                }
                this.reverseSubscriptions.delete(ws)
                this.wsIdMap.delete(ws)
            })
        
        })
    }

    private handleMessage(ws: WebSocket, message: any) {
        switch(message?.type) {
            case 'SUBSCRIBE':
                this.subscribe(ws, message.channel, message.subscriptionId)
                break
            case 'UNSUBSCRIBE':
                this.unsubscribe(ws, message.channel, message.subscriptionId)
                break
            default:
                logger.info('The unknown type for the message:', message)
        }
    }

    private subscribe(ws: WebSocket, channel: string, subscriptionId: string) {
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set())
        }
        this.subscriptions.get(channel)!.add({ws, subscriptionId})
        
        if (!this.reverseSubscriptions.has(ws)) {
            this.reverseSubscriptions.set(ws, new Set())
        }
        this.reverseSubscriptions.get(ws)!.add(channel)
        logger.info(`subscriptionId ${subscriptionId} is added to channel ${channel}`)
    }

    private unsubscribe(ws: WebSocket, channel: string, subscriptionId: string) {
        const clients = this.subscriptions.get(channel)
        if (clients) {
            for (let client of clients) {
                if (client.subscriptionId === subscriptionId) {
                    clients.delete(client)
                    logger.info(`subscriptionId ${subscriptionId} is removed from channel ${channel}`)
                    break
                }
            }
            if (clients.size === 0) {
                this.subscriptions.delete(channel)
            }
        }
        const channels = this.reverseSubscriptions.get(ws)
        if(channels) {
            channels.delete(channel)
        }
    }

    broadcastToChannel(channel: string, data: any) {
        const clients = this.subscriptions.get(channel)
        if (!clients) return 0
        let sentCnt = 0
        
        for (let client of clients) {
            const message = {
                type: 'DATA_UPDATE',
                channel: channel,
                subscriptionId: client.subscriptionId,
                payload: data,
                timestamp: Date.now()
            }
            client.ws.send(JSON.stringify(message))
            sentCnt++
        }
        logger.info(`broadcast message from channel ${channel} to ${sentCnt} clients`)
        return sentCnt;
    }

    sendToChannel(channel: string, subscriptionId: string, data: any) {
        const clients = this.subscriptions.get(channel)
        if (!clients) {
            throw new Error(`no ws clients for channel ${channel} with subscriptionId ${subscriptionId}`)
        }
        const targetClient = Array.from(clients).find(client => client.subscriptionId === subscriptionId)
        if (!targetClient) throw new Error(`No ws client found for channel ${channel} with subscriptionId ${subscriptionId}`)
        const message = {
            type: 'DATA_UPDATE',
            channel: channel,
            subscriptionId: targetClient?.subscriptionId,
            payload: data,
            timestamp: Date.now()
        }
        targetClient?.ws.send(JSON.stringify(message))
    }

    getSubscriptions() {
        return this.subscriptions
    }

    getReverseSubscriptions() {
        return this.reverseSubscriptions
    }

    getWsIdMap() {
        return this.wsIdMap
    }
}


