
const apiKey = 'QLyqy7ll-NxAiFILvr2Am'
const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
const tokens = [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    '0xz'
]

type TokenType = {
    chainId: number;
    name: string;
    symbol: string;
    decimal: number;
    alias: string;
    address: `0x${string}`;
    company?: string;
}

const tokenMetaMap:Map<number, Map<`0x${string}`, TokenType>> = new Map()


async function getTokenMetadata() {
    try {
        // The token address we want to query for metadata
        const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        const requestBody = {
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getTokenMetadata",
          params: [tokenAddress]
        };
        const response = await fetch(baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (data.error) {
          console.error('Error:', data.error);
          return;
        }
        console.log("TOKEN METADATA");
        console.log(data.result);
      } catch (error) {
        console.error('Request failed:', error);
      }
}

async function fetchWithAllSettled() {
    const results = await Promise.allSettled(
        tokens.map((token) => ({
            jsonrpc: "2.0",
            id: 1,
            method: "alchemy_getTokenMetadata",
            params: [token]
        })).map((requestBody) => fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(res => res.json()))
    )
    results.forEach((res: any, index) => {
        if (res.value.result) {
            console.log(res.value.result)
        }
        if (res.value.error) {
            console.log(res.value.error)
        }
    })

    
}

//getTokenMetadata()
fetchWithAllSettled()
//npx hardhat run scripts\tokenmeta.ts