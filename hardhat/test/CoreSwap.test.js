const { expect } = require("chai");
const { loadFixture } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const { arrayBuffer } = require("stream/consumers");

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18; 
const WETH_DECIMALS = 18; 
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 

describe("CoreSwap", function () {
  async function sharedContractFixture() {
    const coreSwapFactory = await ethers.getContractFactory('CoreSwap')
    const coreSwap = await coreSwapFactory.deploy(SwapRouterAddress)
    await coreSwap.deployed()
    const signers = await ethers.getSigners()
    return {coreSwap, signers}
  }

  describe('swapExactInput', function () {
    it('swapExactInput from WETH9 to DAI', async function () {
      const {coreSwap, signers} = await loadFixture(sharedContractFixture)
      const WETH_WHALE='0x3ee18B2214AFF97000D974cf647E7C347E8fa585'

      const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
      const DAI = await ethers.getContractAt('IERC20', DAI_ADDRESS)

      //Unlock WETH whale
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WETH_WHALE],
      });
      const wethWhale = await ethers.getSigner(WETH_WHALE)
      await WETH.connect(wethWhale).transfer(signers[0].address, hre.ethers.utils.parseUnits("10", WETH_DECIMALS))

      const weiBalanceBeforeSwap = await WETH.balanceOf(signers[0].address)
      const weiBalanceBefore = Number(ethers.utils.formatUnits(weiBalanceBeforeSwap, WETH_DECIMALS))
      console.log('weiBalanceBefore = ', weiBalanceBefore)

      const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address)
      const daiBalanceBefore = Number(ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS))
      console.log('daiBalanceBefore = ', daiBalanceBefore)

      await WETH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('1', WETH_DECIMALS))
      const amountIn = ethers.utils.parseUnits("0.1", WETH_DECIMALS); 
      const swap = await coreSwap.swapExactInput(WETH_ADDRESS, DAI_ADDRESS, amountIn, { gasLimit: 300000 })
      await swap.wait()

      const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
      const daiBlanceAfter = Number(ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
      console.log('daiBlanceAfter = ', daiBlanceAfter)

      const weiBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
      const weiBlanceAfter = Number(ethers.utils.formatUnits(weiBalanceAfterSwap, WETH_DECIMALS))
      console.log('weiBlanceAfter = ', weiBlanceAfter)
    })

    it.skip('swapExactOutput from DAI to WETH9', async function () {
      const {coreSwap, signers} = await loadFixture(sharedContractFixture)
      const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai
      /* Connect to DAI and mint some tokens  */
      const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS)
      //Unlock DAI whale
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [DAI_WHALE],
      });
      const daiWhale = await ethers.getSigner(DAI_WHALE)
      await DAI.connect(daiWhale).transfer(signers[0].address, hre.ethers.utils.parseUnits("1", DAI_DECIMALS))
  
      /* Check DAI Balance before swap */ 
      const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address);
      const daiBalanceBefore = Number(hre.ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS));
      console.log('daiBalanceBefore = ', daiBalanceBefore)
  
      /* Check wei balance before swap */
      const WETH = await ethers.getContractAt("IERC20", WETH_ADDRESS)  
      const weiBalanceBeforeSwap = await WETH.balanceOf(signers[0].address);
      const weiBalanceBefore = Number(hre.ethers.utils.formatUnits(weiBalanceBeforeSwap, WETH_DECIMALS));
      console.log('weiBalanceBefore = ', weiBalanceBefore)
  
      /* Approve the swapper contract to spend DAI for me */
      await DAI.connect(signers[0]).approve(coreSwap.address, hre.ethers.utils.parseUnits("1", DAI_DECIMALS)); 
  
      /* Execute the swap */
      const amountOut = hre.ethers.utils.parseUnits("0.0001", WETH_DECIMALS); 
      const amountInMaximum = hre.ethers.utils.parseUnits("1", DAI_DECIMALS); 
      const swap = await coreSwap.swapExactOutput(DAI_ADDRESS, WETH_ADDRESS, amountOut, amountInMaximum, { gasLimit: 300000 });
      swap.wait(); 
  
      /* Check DAI end balance */
      const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address);
      const daiBalanceAfter = Number(hre.ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS));
      console.log('daiBalanceAfter = ', daiBalanceAfter)
  
      /* Check wei balance after swap*/
      const weiBalanceAfterSwap = await WETH.balanceOf(signers[0].address);
      const weiBalanceAfter = Number(ethers.utils.formatUnits(weiBalanceAfterSwap, DAI_DECIMALS));
      console.log('weiBalanceAfter = ', weiBalanceAfter)
      
      expect(daiBalanceBefore).to.be.greaterThan(daiBalanceAfter); 
      expect(weiBalanceAfter).to.equal(0.0001)
    })
  })

  describe('getPool', function () {
    it.skip('Check if pool exists', async function () {
      const {coreSwap} = await loadFixture(sharedContractFixture)

      const exist = await coreSwap.getPool(WETH_ADDRESS, DAI_ADDRESS, 100)
      console.log('exist = ', exist)
    } )
  })

});
