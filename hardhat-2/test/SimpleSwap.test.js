const { expect } = require("chai");
const { ethers } = require("hardhat");
const {loadFixture, time} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");


const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18; 
const WETH_DECIMALS = 18; 
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 
const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai


const ercAbi = [
    // Read-Only Functions
    "function balanceOf(address) view returns (uint256)",
    // Authenticated Functions
    "function transfer(address, uint) returns (bool)",
    "function deposit() public payable",
    "function approve(address, uint256) returns (bool)"
  ];

  const weiAbi = [
    "function balanceOf(address) view returns (uint)",
    "function deposit() payable",
    "function withdraw(uint)",
    "function approve(address,uint256) returns (bool)"
  ];
  
  const daiAbi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
  ];

describe('SimpleSwap', function () {
    async function sharedContractFixture() {
        const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap")
        const simpleSwapFactory = await SimpleSwapFactory.deploy(SwapRouterAddress)
        await simpleSwapFactory.waitForDeployment()
        const [acc1, acc2, ...others] = await ethers.getSigners()
        const DAI = new ethers.Contract(DAI_ADDRESS, daiAbi, ethers.provider)
        const WETH = new ethers.Contract(WETH_ADDRESS, weiAbi, ethers.provider)
        return {simpleSwapFactory, acc1, acc2, DAI, WETH}
    }

    describe('swapExactInputSingle', function () {
        it('should success when call swapExactInputSingle', async function () {
            const {simpleSwapFactory, acc1, acc2, WETH, DAI} = await loadFixture(sharedContractFixture)
            const deposit = await WETH.connect(acc1).deposit({value: ethers.parseEther('10')})
            await deposit.wait()

            const weiBalanceBeforeSwap = await WETH.balanceOf(acc1.address)
            const weiBalanceBefore = Number(ethers.formatUnits(weiBalanceBeforeSwap, WETH_DECIMALS))
            console.log('weiBalanceBefore = ', weiBalanceBefore)

            const daiBalanceBeforeSwap = await DAI.balanceOf(acc1.address)
            const daiBalanceBefore = Number(ethers.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS))
            console.log('daiBalanceBefore = ', daiBalanceBefore)

            await WETH.connect(acc1).approve(simpleSwapFactory.getAddress(), ethers.parseEther('1'))
            const amountIn = ethers.parseEther("0.1"); 
            const swap = await simpleSwapFactory.swapExactInputSingle(amountIn, { gasLimit: 300000 })
            await swap.wait()

            const daiBalanceAfterSwap = await DAI.balanceOf(acc1.address)
            const daiBlanceAfter = Number(ethers.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
            console.log('daiBlanceAfter = ', daiBlanceAfter)

            const weiBalanceAfterSwap = await WETH.balanceOf(acc1.address)
            const weiBlanceAfter = Number(ethers.formatUnits(weiBalanceAfterSwap, WETH_DECIMALS))
            console.log('weiBlanceAfter = ', weiBlanceAfter)
        })
    })

    describe('swapExactOutputSingle', function () {

    })



})