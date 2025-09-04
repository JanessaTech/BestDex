import { ethers} from 'ethers'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/lFKEWE2Z7nkAXL73NSeAM2d5EbndwoQk")
const localProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const POOL_ADDRESS = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'; // eg: pool USDC/ETH 0.3% 
const POLL_INTERVAL = 12000;

function getProvider() {
    //return localProvider
    return mainnetProvider
}


async function main() {
    const provider = getProvider()
    const poolContract = new ethers.Contract(POOL_ADDRESS, IUniswapV3PoolABI.abi, provider)
    let lastCheckedBlock = await provider.getBlockNumber()

    const pollSwapEvents = async () => {
        try {
            const currentBlock = await provider.getBlockNumber();
            console.log(`Checking for events from block ${lastCheckedBlock} to ${currentBlock}`);
            if (currentBlock <= lastCheckedBlock) {
                console.log('currentBlock <= lastCheckedBlock')
                return;
            }
            const filter = poolContract.filters.Swap();
            const events = await poolContract.queryFilter(filter, lastCheckedBlock, currentBlock);
            events.forEach((event) => {
                console.log("Swap Event Detected!");
                console.log("address:", event.address);
                console.log("blockHash:", event.blockHash);
                console.log("blockNumber:", event.blockNumber);
                console.log("address:", event.address);
                console.log("data:", event.data);
                console.log("topics:", event.topics);
                console.log("transactionHash:", event.transactionHash);
                console.log("transactionIndex:", event.transactionIndex);
                console.log("logIndex:", event.logIndex);
                console.log("args:");
                if (event.args) {
                  console.log("    sender:", event.args.sender);
                  console.log("    recipient:", event.args.recipient);
                  console.log("    amount0:", event.args.amount0.toString());
                  console.log("    amount1:", event.args.amount1.toString());
                  console.log("    sqrtPriceX96:", event.args.sqrtPriceX96.toString());
                  console.log("    liquidity:", event.args.liquidity.toString());
                  console.log("    tick:", event.args.tick);
                }
                console.log("--------------------------------------");
              });
          
              lastCheckedBlock = currentBlock;
        } catch (error) {
            console.error("Error during polling:", error)
        }
    }
    const interval = setInterval(pollSwapEvents, POLL_INTERVAL)
}
main().catch((err) => {
    console.log(err)
})

//npx hardhat run scripts\localMonitor_swap.ts