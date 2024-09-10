## How to create the project from scratch

```

```

## How to compile and test

```
compile:
    npx hardhat compile
test:
    npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk
    npx hardhat test --network localhost .\test\liquidity.test.js
    npx hardhat test --network localhost .\test\SimpleSwap.test.js
```
