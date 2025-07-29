const { ethers } = require("hardhat") 

async function main() {
    const provider = ethers.provider;
    const feeData = await provider.getFeeData();
    const [acount1, ...others] = await ethers.getSigners()
    const Hello = await ethers.deployContract("Hello", ['JanessaTech'], 
        {maxFeePerGas: feeData.maxFeePerGas * 2n, // 预留波动空间
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas});
    await Hello.waitForDeployment();

  console.log('Hello is deployed at:', await Hello.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  //npx hardhat run scripts/deploy.js --network localhost