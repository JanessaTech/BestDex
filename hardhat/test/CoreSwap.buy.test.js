const { expect } = require("chai");
const { loadFixture } = require("ethereum-waffle");
const { ethers, network } = require("hardhat");

const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 

describe("CoreSwap", function () {
    async function sharedContractFixture() {
        const coreSwapFactory = await ethers.getContractFactory('CoreSwap')
        const coreSwap = await coreSwapFactory.deploy(SwapRouterAddress)
        await coreSwap.deployed()
        const signers = await ethers.getSigners()
        const mins = 30
        const feeTier = 3000; // For simplicity, choose 0.3% for all of token pairs
        return {coreSwap, signers, mins, feeTier}
    }

    describe('buy', function () {
        it.skip('buy from DAI to WETH', async function () {
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai
            /* Connect to DAI and mint some tokens  */
            const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS)
            const WETH = await ethers.getContractAt("IERC20", WETH_ADDRESS) 
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
             
            const weiBalanceBeforeSwap = await WETH.balanceOf(signers[0].address);
            const weiBalanceBefore = Number(hre.ethers.utils.formatUnits(weiBalanceBeforeSwap, WETH_DECIMALS));
            console.log('weiBalanceBefore = ', weiBalanceBefore)
        
            /* Approve the swapper contract to spend DAI for me */
            await DAI.connect(signers[0]).approve(coreSwap.address, hre.ethers.utils.parseUnits("1", DAI_DECIMALS)); 
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("0.0001", WETH_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("1", DAI_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(DAI_ADDRESS, WETH_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 });
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
})