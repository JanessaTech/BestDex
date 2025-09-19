const { expect } = require("chai");
const { ethers } = require("hardhat");
const {loadFixture, time} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const DAI_WHALE = "0xD1668fB5F690C59Ab4B0CAbAd0f8C1617895052B"
const USDC_WHALE = "0xF977814e90dA44bFA03b6295A0616a897441aceC"
const erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function approve(address,uint256) returns (bool)",
    "function transfer(address, uint256) returns (bool)"
  ];

describe('LiquidityExamples', function () {
    let liquidityExamples
    let accounts
    let dai
    let usdc

    before(async () => {
        accounts = await ethers.getSigners()

        const LiquidityExamples = await ethers.getContractFactory("LiquidityExamples")
        liquidityExamples = await LiquidityExamples.deploy()
        await liquidityExamples.waitForDeployment()
    
        dai = new ethers.Contract(DAI_ADDRESS, erc20Abi, ethers.provider)
        usdc = new ethers.Contract(USDC_ADDRESS, erc20Abi, ethers.provider)
    
        //Unlock DAI and USDC whales
        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [DAI_WHALE],
        })
        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [USDC_WHALE],
        })
    
        const daiWhale = await ethers.getSigner(DAI_WHALE)
        const usdcWhale = await ethers.getSigner(USDC_WHALE)
    
        // Send DAI and USDC to admin
        let daiAmount = 10n * 10n ** 18n
        let usdcAmount = 10n * 10n ** 6n
        const DAI_DECIMALS = 18
        const USDC_DECIMALS = 6
    
        expect(await dai.balanceOf(daiWhale.address)).to.gte(daiAmount)
        expect(await usdc.balanceOf(usdcWhale.address)).to.gte(usdcAmount)
    
        await dai.connect(daiWhale).transfer(accounts[0].address, daiAmount)
        await usdc.connect(usdcWhale).transfer(accounts[0].address, usdcAmount)

        const daiBalanceBeforeMint = await dai.balanceOf(accounts[0].address)
        const daiBalanceBefore = Number(ethers.formatUnits(daiBalanceBeforeMint, DAI_DECIMALS))
        const usdcBalanceBeforeMint = await usdc.balanceOf(accounts[0].address)
        const usdcBalanceBefore = Number(ethers.formatUnits(usdcBalanceBeforeMint, USDC_DECIMALS))
        console.log('daiBalanceBefore = ', daiBalanceBefore)
        console.log('usdcBalanceBefore = ', usdcBalanceBefore)
    })
    
    it('mintNewPosition', async function () {
        let daiAmount = 2n * 10n ** 18n
        let usdcAmount = 2n * 10n ** 6n
        await dai.connect(accounts[0]).transfer(liquidityExamples.getAddress(), daiAmount)
        await usdc.connect(accounts[0]).transfer(liquidityExamples.getAddress(), usdcAmount)
   
        await liquidityExamples.mintNewPosition()
        console.log("DAI balance after add liquidity",await dai.balanceOf(accounts[0].address))
        console.log("USDC balance after add liquidity", await usdc.balanceOf(accounts[0].address))
    })

    it("increaseLiquidityCurrentRange", async () => {
        const daiAmount = 3n * 10n ** 18n
        const usdcAmount = 3n * 10n ** 6n
    
        await dai.connect(accounts[0]).approve(liquidityExamples.getAddress(), daiAmount)
        await usdc.connect(accounts[0]).approve(liquidityExamples.getAddress(), usdcAmount)
    
        await liquidityExamples.increaseLiquidityCurrentRange(daiAmount, usdcAmount)
        console.log("DAI balance after increase liquidity",await dai.balanceOf(accounts[0].address))
        console.log("USDC balance after increase liquidity", await usdc.balanceOf(accounts[0].address))
    })

    it("decreaseLiquidity", async () => {
        const tokenId = await liquidityExamples.tokenId()
        const liquidity = await liquidityExamples.getLiquidity(tokenId)

        await liquidityExamples.decreaseLiquidity(liquidity)

        console.log("--- decrease liquidity ---")
        console.log(`liquidity ${liquidity}`)
        console.log('accounts[0].address:', accounts[0].address)
        console.log("DAI balance after decrease liquidity",await dai.balanceOf(accounts[0].address))
        console.log("USDC balance after decrease liquidity", await usdc.balanceOf(accounts[0].address))
    })
    
})

// note  blockNumber:23043400 in hardhat.config.js