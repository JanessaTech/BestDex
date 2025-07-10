const { ethers, network } = require("hardhat");

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const feeTier = 3000

function test() {
    const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [WETH_ADDRESS, feeTier, USDC_ADDRESS, feeTier, WBTC_ADDRESS])
    console.log(path)
}

test()

// npx hardhat run .\scripts\tmp.js