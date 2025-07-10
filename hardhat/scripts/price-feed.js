/**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

const { ethers } = require("ethers") // for nodejs only
//const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia")
const provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com")
const aggregatorV3InterfaceABI = [
  'function latestAnswer() view returns (int256)',
  'function latestTimestamp() view returns (uint256)',
  'function latestRound() view returns (uint256)',
  'function getAnswer(uint256 _roundId) view returns (int256)',
  'function getTimestamp(uint256 _roundId) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function getRoundData(uint80 _roundId) view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function description() view returns (string)',
  'function version() view returns (uint256)'
]
//const addr = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"
const addr = "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9"  // the address of datafeed for DAI/USD -- Ethereum Mainnet

const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
priceFeed.latestRoundData().then((roundData) => {
  // Do something with roundData
  console.log("Latest Round Data", roundData)
})
priceFeed.decimals().then((decimal) => {
  console.log('decimal = ', decimal)
})

// npx hardhat run .\scripts\price-feed.js
