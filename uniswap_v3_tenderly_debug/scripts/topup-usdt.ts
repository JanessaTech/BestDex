import { ethers } from "hardhat"

const usdt_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
];
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
const USDT_WHALE = "0xF977814e90dA44bFA03b6295A0616a897441aceC"
const MY_ACCOUNT = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

async function main() {
    const provider = ethers.provider;
    const feeData = await provider.getFeeData();
    await ethers.provider.send("hardhat_impersonateAccount", [USDT_WHALE]);
    const whale = await ethers.getSigner(USDT_WHALE);
    const usdc = new ethers.Contract(USDT_ADDRESS, usdt_ABI, whale);
    const amount = ethers.utils.parseUnits("2000", 6);
    console.log(`Transferring ${ethers.utils.formatUnits(amount, 6)} USDT to ${MY_ACCOUNT}...`);
    const whaleBalance = await usdc.balanceOf(USDT_WHALE);
    console.log(
        "whale balance:",
        ethers.utils.formatUnits(whaleBalance, 6),
        "USDT"
    );
    const tx = await usdc.transfer(MY_ACCOUNT, amount, {
        maxFeePerGas: feeData.maxFeePerGas? feeData.maxFeePerGas.mul(2): null,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    });
    await tx.wait();

    const myBalance = await usdc.balanceOf(MY_ACCOUNT);
    console.log(
        "My USDT balance:",
        ethers.utils.formatUnits(myBalance, 6),
        "USDT"
    );
    await ethers.provider.send("hardhat_stopImpersonatingAccount", [USDT_WHALE]);
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/topup-usdt.ts --network localhost    //blockNumber: 23396231