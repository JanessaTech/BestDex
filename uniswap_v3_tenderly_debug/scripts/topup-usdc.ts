import { ethers } from "hardhat"

const usdc_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
];
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const USDC_WHALE = "0xF977814e90dA44bFA03b6295A0616a897441aceC"
const MY_ACCOUNT = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

async function main() {
    const provider = ethers.provider;
    const feeData = await provider.getFeeData();
    await ethers.provider.send("hardhat_impersonateAccount", [USDC_WHALE]);
    const whale = await ethers.getSigner(USDC_WHALE);
    const usdc = new ethers.Contract(USDC_ADDRESS, usdc_ABI, whale);
    const amount = ethers.utils.parseUnits("1000", 6);
    console.log(`Transferring ${ethers.utils.formatUnits(amount, 6)} USDC to ${MY_ACCOUNT}...`);
    const whaleBalance = await usdc.balanceOf(USDC_WHALE);
    console.log(
        "whale balance:",
        ethers.utils.formatUnits(whaleBalance, 6),
        "USDC"
    );
    const tx = await usdc.transfer(MY_ACCOUNT, amount, {
        maxFeePerGas: feeData.maxFeePerGas? feeData.maxFeePerGas.mul(2): null,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    });
    await tx.wait();

    const myBalance = await usdc.balanceOf(MY_ACCOUNT);
    console.log(
        "My USDC balance:",
        ethers.utils.formatUnits(myBalance, 6),
        "USDC"
    );
    await ethers.provider.send("hardhat_stopImpersonatingAccount", [USDC_WHALE]);
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/topup-usdc.ts --network localhost