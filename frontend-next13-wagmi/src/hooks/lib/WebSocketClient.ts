import logger from "@/common/Logger";
import { CHANNELS } from "@/config/constants";
import { PoolInfo } from "@/lib/client/types";
import { dataTagErrorSymbol } from "@tanstack/react-query";


enum WebSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

export interface WebSocketConfig {
    url: string;
    maxReconnectAttempts: number;
    reconnectInterval : number;
    heartbeatInterval?: number;
}

export interface WebSocketMessage {
    type: string;
    channel?: string;
    subscriptionId?: string;
    payload?: any;
    timestamp?: number
}

export interface Subscription {
    channel: string;
    callback: (fullData: WebSocketMessage) => void; 
    options?: SubscriptionOptions
}

// for extension
export interface SubscriptionOptions {}

export class WebSocketClient {
    private ws: WebSocket | null = null
    private isConnecting: boolean = false;
    private config!: WebSocketConfig;
    private reconnectAttempts : number = 0;
    private reconnectTimer?: NodeJS.Timeout;
    private heartbeatTimer?: NodeJS.Timeout;
    private manualStop: boolean = false;
    
    private subscriptions!: Map<string, Subscription>

    private latestPoolInfoMap:Map<number, Map<string, PoolInfo>> = new Map()

    constructor(_config: WebSocketConfig) {
        this.config = _config
        this.subscriptions = new Map<string, Subscription>()
    }


    private setupEventListeners(): void {
        if (!this.ws) return
        this.ws.onopen = (event: Event) => {
            this.isConnecting = false
            this.reconnectAttempts = 0
            logger.info('Connected to websocket!')

            //this.startHeartbeat()
        }

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data as string)
                this.handleMessage(data)
            } catch(error) {
                logger.error('failed to parse message:', error, event.data)
            }
        }

        this.ws.onerror = (event: Event) => {
            this.isConnecting = false
            logger.error('Failed to connect to websocket, retry...')
            this.handleReconnect()
        }

        this.ws.onclose =  (event: CloseEvent) => {
            this.isConnecting = false
            logger.info(`websocket is closed. code: ${event.code}, reason: ${event.reason}`)
            this.clearHeartbeat()
            if (event.code === 100) {
                logger.info('websocket is closed successfully, exit')
                return
            }
            if (this.manualStop) {
                logger.info('websocket is closed manually, exit')
                return
            }
            logger.info('websocket is closed unexpected, reconnecting ...')
            this.handleReconnect()
        }
    }

    private handleReconnect(): void {
        // if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
        //     logger.error(`Reached the max reconnect attempts ${this.config.maxReconnectAttempts}, Stop!`)
        //     return
        // }
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = undefined
        }
        this.reconnectAttempts++;
        let delay = 0
        if (this.reconnectAttempts > this.config.maxReconnectAttempts) {
            delay = 100000
        } else {
            delay  = this.config.reconnectInterval ** this.reconnectAttempts
        }
         
        logger.info(`Try to reconnect... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts}). Delay: ${delay} ms`)

        this.reconnectTimer = setTimeout(() => {
            this.connect()
        }, delay)
    }

    private startHeartbeat(): void {
        if (!this.config?.heartbeatInterval || this.config.heartbeatInterval <= 0) return
        this.clearHeartbeat()
        if (this.ws?.readyState === WebSocketReadyState.OPEN) {
            this.heartbeatTimer = setInterval(() => {
                const heartbeatMsg: WebSocketMessage = {
                    type: 'PING',
                    timestamp: Date.now()
                }
                this.send(heartbeatMsg)
                logger.info('one heartbeat is sent')
            }, this.config.heartbeatInterval)
        }
    }

    private clearHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = undefined;
        }
    }

    private handleMessage(data: WebSocketMessage): void {
        //logger.info('handleMessage:', data)
        if (data.type === 'DATA_UPDATE' && data.subscriptionId) {
            this.updateLatest(data)
            // call callback
            const subcription = this.subscriptions.get(data.subscriptionId)
            if (subcription?.callback) {
                subcription.callback(data)
            }
            return
        }
        // deal with the rest of types - TBD
    }

    private updateLatest(data: WebSocketMessage) {
        if (data.type === 'DATA_UPDATE' && data.channel === CHANNELS.POOLINFO) {
            const {chainId, poolAddress, poolInfo} = data.payload as {chainId: number, poolAddress: string, poolInfo: PoolInfo}
            if (!this.latestPoolInfoMap.get(chainId)) {
                this.latestPoolInfoMap.set(chainId, new Map())
            }
            this.latestPoolInfoMap.get(chainId)?.set(poolAddress.toLowerCase(), poolInfo)
            // logger.info('chainId =', chainId)
            // logger.info('poolAddress =', poolAddress)
            // logger.info('poolInfo =', poolInfo)
        }
    }

    private generateId(): string {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    private send(message: WebSocketMessage) {
        if (!this.ws || this.ws.readyState !== WebSocketReadyState.OPEN) {
            throw new Error('Failed to send meesage when ws is empty or readyState is not open')
        }
        try {
            this.ws.send(JSON.stringify(message))
        } catch(error) {
            logger.error('failed to send message:', error)
            throw error
        }
    }

    connect(): void {
        if (typeof window === undefined) {
            logger.info('Not in window, skip to connect to ws')
            return
        }
        if (this.isConnecting || this.ws?.readyState === WebSocketReadyState.OPEN) return
        this.isConnecting = true
        this.manualStop = false

        try {
            this.ws = new WebSocket(this.config.url)
            this.setupEventListeners()
        } catch (error) {
            logger.error('Failed to create websocket:', error)
            this.isConnecting = false
            this.handleReconnect()
        }
    }

    disconnect(code: number = 3000, reason: string = 'normal close'): void {
        logger.info(`close websocket manually.code: ${code}, reason: ${reason}`)
        
        this.clearHeartbeat()
        
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
        }
    
        if (this.ws) {
          this.ws.close(code, reason);
        }
    
        this.subscriptions.clear();
        this.manualStop = true;
    }

    subscribe(
        channel: string,
        callback: (fullData: WebSocketMessage) => void,
        options?: SubscriptionOptions
        ): string {
            const subscriptionId = this.generateId()
            const subscribeMsg: WebSocketMessage = {
                type: 'SUBSCRIBE',
                channel: channel,
                subscriptionId: subscriptionId
            }
            this.send(subscribeMsg)
            this.subscriptions.set(subscriptionId, {channel, callback, options})
            logger.info('subscribe is successful')
            return subscriptionId
    }

    unsubscribe(subscriptionId: string): void {
        const subscription = this.subscriptions.get(subscriptionId)
        if (!subscription) throw new Error('no subscription found')
        const unsubscribeMsg: WebSocketMessage = {
            type: 'UNSUBSCRIBE',
            channel: subscription.channel,
            subscriptionId: subscriptionId
        }
        this.send(unsubscribeMsg)
        logger.info('unsubscribe is successful')
        this.subscriptions.delete(subscriptionId)
    }

    getConnectionState(): string {
        if (!this.ws) return 'NOT_INITIALIZED'
        switch (this.ws.readyState) {
            case WebSocketReadyState.CONNECTING:
                return 'CONNECTING';
            case WebSocketReadyState.OPEN:
                return 'OPEN';
            case WebSocketReadyState.CLOSING:
                return 'CLOSING';
            case WebSocketReadyState.CLOSED:
                return 'CLOSED';
            default:
                return 'UNKNOWN';
        }
    }

    getSubscriptionCount(): number {
        return this.subscriptions.size;
    }

    getSubscriptions():Map<string, Subscription> {
        return this.subscriptions
    }

    getLatestPoolInfo(chainId: number, poolAddress: string) {
        return this.latestPoolInfoMap.get(chainId)?.get(poolAddress.toLowerCase())
    }
}