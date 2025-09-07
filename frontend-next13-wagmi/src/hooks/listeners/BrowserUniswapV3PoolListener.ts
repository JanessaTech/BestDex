import { PoolInfo, fetchPoolInfo } from '@/lib/tools/pool';
import { PublicClient } from 'viem'

class BrowserUniswapV3PoolListener {
    private ws: WebSocket | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private subscriptionId: string | null = null;

    private latestResult: number = 0;

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
        console.log(`Create a websocket for pool ${this.poolAddress} via wss ${this.wssURL}`);
        try {
            this.ws = new WebSocket(this.wssURL)
            this.ws.addEventListener('open', () => {
                console.log('Connected to Alchemy WebSocket');
                this.reconnectAttempts = 0;
                this.subscribeToSwapEvents(this.poolAddress);
            })
            this.ws.addEventListener('message', (data: MessageEvent) => {
                this.handleMessage(data);
            })
            this.ws.addEventListener('close', (event: CloseEvent) => {
                console.log(`WebSocket connection closed: ${event.code} - ${event.reason}`);
            })
            this.ws.addEventListener('error', (event: Event) => {
                console.error('WebSocket error:', event);
                this.handleReconnection();
            })
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
            this.handleReconnection();
        }
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const message = JSON.parse(event.data);
    
            if (message.id === 1) { // to differentiate the subscription response from events
                if (message.result) {
                    console.log('Subscription successful with ID:', message.result);
                    this.subscriptionId = message.result;
                } else if (message.error) {
                    console.error('Subscription failed:', message.error)
                }
                return
            }
    
            if (message.params?.subscription && message.params?.result) {
                if (this.subscriptionId && message.params.subscription === this.subscriptionId) {
                    // received a swap event
                    console.log('Pool State Changed! A swap occurred.');
                    console.log(JSON.stringify(message, null, 2));
                    //this.latestResult = message.params?.result;
                    // get pool info here
                    (async () => {
                        await this.fetchPoolData(); 
                    })()
                } 
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error)
        }
        
    }

    private subscribeToSwapEvents(poolAddress: string): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
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
            console.error('Max reconnection attempts reached');
            return;
          }
          
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
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

    public getLatestResult() {
        return this.latestResult;
    }

}

export default BrowserUniswapV3PoolListener