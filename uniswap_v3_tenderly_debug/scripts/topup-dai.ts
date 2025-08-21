import { ethers } from "hardhat"


const DAI_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
];
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const DAI_WHALE = "0xD1668fB5F690C59Ab4B0CAbAd0f8C1617895052B"
const MY_ACCOUNT = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

async function main() {
    const provider = ethers.provider;
    const feeData = await provider.getFeeData();
    await ethers.provider.send("hardhat_impersonateAccount", [DAI_WHALE]);
    const whale = await ethers.getSigner(DAI_WHALE);
    const dai = new ethers.Contract(DAI_ADDRESS, DAI_ABI, whale);
    const amount = ethers.utils.parseUnits("1000", 18);
    console.log(`Transferring ${ethers.utils.formatUnits(amount, 18)} DAI to ${MY_ACCOUNT}...`);
    const whaleBalance = await dai.balanceOf(DAI_WHALE);
    console.log(
        "whale dai balance:",
        ethers.utils.formatUnits(whaleBalance, 18),
        "DAI"
    );

    const tx = await dai.transfer(MY_ACCOUNT, amount, {
        maxFeePerGas: feeData.maxFeePerGas? feeData.maxFeePerGas.mul(2): null,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    });
    await tx.wait();

    const myBalance = await dai.balanceOf(MY_ACCOUNT);
    console.log(
        "My DAI balance:",
        ethers.utils.formatUnits(myBalance, 18),
        "DAI"
    );
    await ethers.provider.send("hardhat_stopImpersonatingAccount", [DAI_WHALE]);
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/topup-dai.ts --network localhost