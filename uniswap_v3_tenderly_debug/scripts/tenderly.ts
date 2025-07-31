import {ethers} from "hardhat";
//const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/')
const localProvider = new ethers.providers.JsonRpcProvider('https://virtual.mainnet.eu.rpc.tenderly.co/788e8993-30e7-40ea-8442-f5b91c13efd0')

async function main() {
    const blockNum = await localProvider.getBlockNumber()
    console.log('blockNum =', blockNum)
}

main().then().catch((e) => {
    console.log(e)
})

//npx hardhat run scripts/tenderly.ts