const { expect } = require("chai")
const { ethers } = require("hardhat")

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const DAI_WHALE = "0x1819ede3b8411ebc613f3603813bf42ae09ba5a5"
const USDC_WHALE = "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"

describe("LiquidityExamples", () => {
    let liquidityExamples
    let accounts
    let dai
    let usdc

    before(async () => {
    accounts = await ethers.getSigners()

    const LiquidityExamples = await ethers.getContractFactory("LiquidityExamples")
    liquidityExamples = await LiquidityExamples.deploy()
    await liquidityExamples.deployed()

    dai = await ethers.getContractAt("IERC20", DAI)
    usdc = await ethers.getContractAt("IERC20", USDC)

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

    // Send DAI and USDC to accounts[0]
    let daiAmount = 10n * 10n ** 18n
    let usdcAmount = 10n * 10n ** 6n

    expect(await dai.balanceOf(daiWhale.address)).to.gte(daiAmount)
    expect(await usdc.balanceOf(usdcWhale.address)).to.gte(usdcAmount)

    await dai.connect(daiWhale).transfer(accounts[0].address, daiAmount)
    await usdc.connect(usdcWhale).transfer(accounts[0].address, usdcAmount)
  })
 
  it("mintNewPosition", async () => {
     let daiAmount = 2n * 10n ** 18n
     let usdcAmount = 2n * 10n ** 6n
     await dai.connect(accounts[0]).transfer(liquidityExamples.address, daiAmount)
     await usdc.connect(accounts[0]).transfer(liquidityExamples.address, usdcAmount)

     await liquidityExamples.mintNewPosition()
     console.log(
      "DAI balance after add liquidity",
      await dai.balanceOf(accounts[0].address)
    )
    console.log(
      "USDC balance after add liquidity",
      await usdc.balanceOf(accounts[0].address)
    )

  }) 

  it("collectAllFees", async () => {
    await liquidityExamples.collectAllFees()

    console.log("--- collect fees ---")
    console.log(`dai ${await dai.balanceOf(liquidityExamples.address)}`)
    console.log(`usdc ${await usdc.balanceOf(liquidityExamples.address)}`)
  })

  it("increaseLiquidityCurrentRange", async () => {
    const daiAmount = 3n * 10n ** 18n
    const usdcAmount = 3n * 10n ** 6n

    await dai.connect(accounts[0]).approve(liquidityExamples.address, daiAmount)
    await usdc
      .connect(accounts[0])
      .approve(liquidityExamples.address, usdcAmount)

    await liquidityExamples.increaseLiquidityCurrentRange(daiAmount, usdcAmount)
  })
  it("decreaseLiquidity", async () => {
    const tokenId = await liquidityExamples.tokenId()
    const liquidity = await liquidityExamples.getLiquidity(tokenId)

    await liquidityExamples.decreaseLiquidity(liquidity)

    console.log("--- decrease liquidity ---")
    console.log(`liquidity ${liquidity}`)
    console.log(`dai ${await dai.balanceOf(liquidityExamples.address)}`)
    console.log(`usdc ${await usdc.balanceOf(liquidityExamples.address)}`)
  })

  it("getNonexitingPool", async () => {
    const token1 = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    //const token2 = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    const token2 = '0x4F26FfBe5F04ED43630fdC30A87638d53D0b0876'
    await liquidityExamples.getPool(token1, token2, 3000)
  })
  it("createPool", async () => {
    const token1 = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    const token2 = '0x4F26FfBe5F04ED43630fdC30A87638d53D0b0876'
    await liquidityExamples.createPool(token1, token2, 3000)
  })
  it("checkNewPool", async () => {
    const token1 = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    //const token2 = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    const token2 = '0x4F26FfBe5F04ED43630fdC30A87638d53D0b0876'
    await liquidityExamples.getPool(token1, token2, 3000)
  }) 

})