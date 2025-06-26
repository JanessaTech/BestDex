## Important about this project

I don't maintain this project any more. if you need to checkout the latest changes, pls move on to hardhat2 under the same dir
If you need to run this project, pls upgrade hardhat to v2.22.14 or above to make sure
the coommand 'npx hardhat node --fork ...' could work well

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
    npx hardhat test --network localhost .\test\CoreSwap.sell.test.js
    npx hardhat test --network localhost .\test\CoreSwap.buy.test.js
```

npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am

npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am --fork-block-number 11095000

## How to run scripts

```
npx hardhat run .\scripts\convert-abi.js
npx hardhat run .\scripts\price-feed.js
```
