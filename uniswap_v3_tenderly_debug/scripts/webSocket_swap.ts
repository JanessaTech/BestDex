import WebSocket from 'ws'

const ALCHEMY_WS_URL = 'wss://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk';
const ALCHEMY_HTTP_URL = 'https://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk';
//const POOL_ADDRESS = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'; // eg: pool USDC/ETH 0.3% 
const POOL_ADDRESS = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'; // eg: pool USDC/WETH 0.05% 

class UniswapV3PoolListener {
    private ws: WebSocket | null = null
    private isConnected: boolean = false
    private reconnectAttempts: number = 0
    private maxReconnectAttempts: number = 5

    constructor() {
        this.initWebSocket()
        this.warmup()
    }

    private initWebSocket(): void {
        try {
            this.ws = new WebSocket(ALCHEMY_WS_URL)
            this.ws.on('open', () => {
                console.log('Connected to Alchemy WebSocket')
                this.isConnected = true
                this.reconnectAttempts = 0
                this.subscribeToSwapEvents()
            })
            this.ws.on('message', (data: WebSocket.Data) => {
                this.handleMessage(data)
            })
            this.ws.on('close', (code: number, reason: string) => {
                console.log(`WebSocket connection closed: ${code} - ${reason}`)
                this.isConnected = false
            })
            this.ws.on('error', (error: Error) => {
                console.error('WebSocket error:', error)
                this.isConnected = false
                this.handleReconnection()
            })
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error)
            this.handleReconnection()
        }
    }

    private warmup(): void {
        (async () => {
            console.log('run warm up')
            await this.fetchPoolData(); 
        })()
    }

    private handleMessage(data: WebSocket.Data): void {
        try {
            const message = JSON.parse(data.toString());
    
            if (message.id === 1) { // to diff subscription response from events
                if (message.result) {
                    console.log('Subscription successful with ID:', message.result);
                } else if (message.error) {
                    console.error('Subscription failed:', message.error)
                }
                return
            }
    
            if (message.params?.result) {
              // received a swap event
              console.log('Pool State Changed! A swap occurred.')
              console.log(JSON.stringify(message, null, 2))
              
              // get pool info here
              //fetchPoolData(POOL_ADDRESS); 
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error)
        }
        
    }

    private subscribeToSwapEvents(): void {
        if (!this.ws || !this.isConnected) {
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
        this.isConnected = false;
    }

    public async fetchPoolData(): Promise<void> {

    }

}
function main0() {
    let ws:WebSocket
    try {
        ws = new WebSocket(ALCHEMY_WS_URL)
        ws.on('open', () => {
            console.log('Connected to Alchemy WebSocket')
            const subscriptionRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "eth_subscribe",
                params: [
                  "logs",
                  {
                    address: POOL_ADDRESS,
                    topics: [
                      // hash code for Swap topic
                      "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
                    ]
                  }
                ]
              };
              ws.send(JSON.stringify(subscriptionRequest));
        })
    
        ws.on('message', (data: WebSocket.RawData) => {
            const message = JSON.parse(data.toString());
    
            if (message.id === 1) { // to diff subscription response from events
                if (message.result) {
                    console.log('Subscription successful with ID:', message.result);
                } else if (message.error) {
                    console.error('Subscription failed:', message.error)
                }
                return
            }
    
            if (message.params?.result) {
              // received a swap event
              console.log('Pool State Changed! A swap occurred.');
              console.log(JSON.stringify(message, null, 2))
              
              // get pool info here
              //fetchPoolData(POOL_ADDRESS); 
            }
        })
    
        ws.on('close', (code: number, reason: string) => {
            console.log(`WebSocket connection closed: ${code} - ${reason}`);
    
        })
        ws.on('error', (error: Error) => {
            console.error('WebSocket error:', error)
    
        })
    } catch(error) {
        console.error('Failed to initialize WebSocket:', error);
    }

    process.on('SIGINT', () => {
        if (ws) {
            console.log('Disconnecting...');
            ws.close();
            process.exit(0);
        }
      });
}

function main() {
    const poolListener = new UniswapV3PoolListener()
    process.on('SIGINT', () => {
        console.log('Disconnecting...');
        poolListener.disconnect();
        process.exit(0);
    });
}

main()

//npx hardhat run scripts\webSocket_swap.ts