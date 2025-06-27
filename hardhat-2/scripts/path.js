
const { ethers } = require("hardhat");

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const feeTier = 3000;

function test() {
  const path = ethers.solidityPacked(["address", "uint24", "address", "uint24", "address"],
    [
      ethers.getAddress(WETH_ADDRESS),  // 确保地址校验
      feeTier,
      ethers.getAddress(USDC_ADDRESS),
      feeTier, 
      ethers.getAddress(WBTC_ADDRESS)
    ]
   )
  console.log(path)
  const target = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000bb8a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000bb82260fac5e5542a773aa44fbcfedf7c193bc2c599'
  console.log(target)
}

test();

// npx hardhat run .\scripts\path.js