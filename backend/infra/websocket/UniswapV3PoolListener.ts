import { PublicClient } from 'viem'
import { PoolInfo } from '../types/TypesInInfra';
import WebSocket from 'ws'
import logger from '../../helpers/logger';
import { fetchPoolInfo } from '../utils/Pool';

class UniswapV3PoolListener {
    private ws: WebSocket | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private subscriptionId: string | null = null;
    private poolAddress!:`0x${string}`;
    private wssURL !:string;
    private publicClient !: PublicClient;
    private latestPooInfo?:PoolInfo | undefined = undefined

    constructor(poolAddress: `0x${string}`, wssURL: string, publicClient: PublicClient) {
        this.poolAddress = poolAddress;
        this.wssURL = wssURL;
        this.publicClient = publicClient;
        this.initWebSocket();
    }

    private initWebSocket(): void {
        logger.info(`Create a websocket for pool ${this.poolAddress} via wss ${this.wssURL}`);
        try {
            this.ws = new WebSocket(this.wssURL)
            this.ws.on('open', () => {
                logger.info('Connected to Alchemy WebSocket');
                this.reconnectAttempts = 0;
                this.subscribeToSwapEvents(this.poolAddress);
            })
            this.ws.on('message', (data: WebSocket.Data) => {
                this.handleMessage(data);
            })
            this.ws.on('close', (code: number, reason: string) => {
                logger.info(`WebSocket connection closed: ${code} - ${reason}`);
            })
            this.ws.on('error',(error: Error) => {
                logger.error('WebSocket error:', error)
                this.handleReconnection();
            })
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
            this.handleReconnection();
        }
    }

    private handleMessage(data: WebSocket.Data): void {
        try {
            const message = JSON.parse(data.toString());
    
            if (message.id === 1) { // to differentiate the subscription response from events
                if (message.result) {
                    logger.info('Subscription successful with ID:', message.result);
                    this.subscriptionId = message.result;
                } else if (message.error) {
                    logger.error('Subscription failed:', message.error)
                }
                return
            }
    
            if (message.params?.subscription && message.params?.result) {
                if (this.subscriptionId && message.params.subscription === this.subscriptionId) {
                    // received a swap event
                    logger.info('Pool State Changed! A swap occurred.');
                    logger.info(JSON.stringify(message, null, 2));
                    (async () => {
                        await this.fetchPoolData(); 
                    })()
                } 
            }
        } catch (error) {
            logger.error('Error processing WebSocket message:', error)
        }
        
    }

    private subscribeToSwapEvents(poolAddress: string): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            logger.error('WebSocket is not connected');
            return;
        }
        const subscriptionRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_subscribe",
            params: [
              "logs",
              {
                address: poolAddress,
                topics: [
                  // hash for swap event
                  "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
                ]
              }
            ]
          };
          
          this.ws.send(JSON.stringify(subscriptionRequest));
    }

    private handleReconnection(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            logger.error('Max reconnection attempts reached');
            return;
          }
          
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          
          logger.debug(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          setTimeout(() => {
            this.initWebSocket();
          }, delay);
    }

    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
          }
    }

    private async fetchPoolData() {
        console.log(`Start fetching pool info from ${this.poolAddress} for chainId ${await this.publicClient.getChainId()}`)
        const poolInfo = await fetchPoolInfo(this.poolAddress, this.publicClient)
        this.latestPooInfo = poolInfo
    }

    public getLatestPooInfo(): PoolInfo | undefined {
        return this.latestPooInfo
    }
}

export default UniswapV3PoolListener