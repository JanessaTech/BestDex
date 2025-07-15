
async function getPriceFromAlchemy() {

    const apiKey = "QLyqy7ll-NxAiFILvr2Am";
    const url = `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-address`;
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    const data = {
        addresses: [
          {
            network: "eth-mainnet",
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" // USDC
          },
          {
            network: "eth-mainnet",
            address: "0x514910771af9ca656af840dff83e8264ecf986ca" // LINk
          }
        ]
      };

    try {
        const startTime = performance.now()
        const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        console.log(JSON.stringify(res, null, 2)); 
        let endTime = performance.now()
        let executionTime = endTime - startTime
        console.log('it takes times:', executionTime)
        return res; 
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

getPriceFromAlchemy().catch((e) => {
    console.log(e)
})

// how to run:
// npx ts-node .\scripts\getpriceAlchemy.ts