## How to create the project from scratch

```
npm init
npm add --save-dev hardhat
npx hardhat init
npm add @uniswap/v3-periphery @uniswap/v3-core
```

See more at: https://docs.uniswap.org/contracts/v3/guides/local-environment

## How to compile and test

```
compile:
    npx hardhat compile
test:
    npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk
    npx hardhat test --network localhost .\test\liquidity.test.js
    npx hardhat test --network localhost .\test\SimpleSwap.test.js
    npx hardhat test --network localhost .\test\CoreSwap.test.js
```
