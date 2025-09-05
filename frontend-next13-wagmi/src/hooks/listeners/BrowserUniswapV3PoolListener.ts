//import WebSocket from 'ws'

const ALCHEMY_WS_URL = 'wss://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk';
const ALCHEMY_HTTP_URL = 'https://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk';
const POOL_ADDRESS = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'; // eg: pool USDC/ETH 0.3% 

class BrowserUniswapV3PoolListener {
    private ws: WebSocket | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private subscriptionId: string | null = null;

    private latestResult?: any;

    constructor() {
        this.initWebSocket();
    }

    private initWebSocket(): void {
        console.log('init BrowserUniswapV3PoolListener...');
        try {
            this.ws = new WebSocket(ALCHEMY_WS_URL)
            this.ws.addEventListener('open', () => {
                console.log('Connected to Alchemy WebSocket');
                this.reconnectAttempts = 0;
                this.subscribeToSwapEvents();
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
                    this.latestResult = message.params?.result;
                    // get pool info here
                    //fetchPoolData(POOL_ADDRESS); 
                } 
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error)
        }
        
    }

    private subscribeToSwapEvents(): void {
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
                address: POOL_ADDRESS,
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

    public async fetchPoolData(): Promise<void> {

    }

    public getLatestResult(): any {
        return this.latestResult
    }

}

export default BrowserUniswapV3PoolListener