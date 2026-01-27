## How to run

```
npx hardhat node  # run local
npx hardhat node --network virtualMainnet  # for tenderly
npx hardhat node --hostname 0.0.0.0 --fork https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am --fork-block-number 24229566  # for being accessed remotely

```

## Installed dependences

```
npm install ws
npm install @types/ws --save-dev
npm install decimal.js
npm install @uniswap/sdk-core @uniswap/smart-order-router @uniswap/v3-sdk
```
