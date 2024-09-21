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
        /// for DAI
        it('buy from DAI to USDC', async function () {

        })

        it.skip('buy from DAI to WETH', async function () {
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai
            /* Connect to DAI and mint some tokens  */
            const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS)
            const WETH = await ethers.getContractAt("IERC20", WETH_ADDRESS) 

            const DAI_DECIMALS = 18
            const WETH_DECIMALS = 18
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
            const amountInMaximum = hre.ethers.utils.parseUnits("0.3", DAI_DECIMALS); 
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

          it('buy from DAI to WBTC', async function () {
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai
            /* Connect to DAI and mint some tokens  */
            const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS)
            const WBTC = await ethers.getContractAt("IERC20", WBTC_ADDRESS) 

            const DAI_DECIMALS = 18
            const WBTC_DECIMALS = 8
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
             
            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address);
            const wbtcBalanceBefore = Number(hre.ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS));
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)
        
            /* Approve the swapper contract to spend DAI for me */
            await DAI.connect(signers[0]).approve(coreSwap.address, hre.ethers.utils.parseUnits("1", DAI_DECIMALS)); 
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("0.00001", WBTC_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("1", DAI_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [WBTC_ADDRESS, feeTier, USDC_ADDRESS, feeTier, DAI_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(DAI_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 });
            swap.wait(); 
        
            /* Check DAI end balance */
            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address);
            const daiBalanceAfter = Number(hre.ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS));
            console.log('daiBalanceAfter = ', daiBalanceAfter)
        
            /* Check wbtc balance after swap*/
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address);
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS));
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
            
            expect(daiBalanceBefore).to.be.greaterThan(daiBalanceAfter); 
            expect(wbtcBalanceAfter).to.equal(0.00001)
          })

          it('buy from DAI to ZRX', async function () {

          })

          it('buy from DAI to 1INCH', async function () {

          })

          /// for USDC
          it('buy from USDC to DAI', async function () {

          })
          it('buy from USDC to WETH', async function () {

          })
          it('buy from USDC to WBTC', async function () {

          })
          it('buy from USDC to ZRX', async function () {

          })
          it('buy from USDC to 1INCH', async function () {

          })

          /// for WETH
          it('buy from WETH to DAI', async function () {

          })
          it('buy from WETH to USDC', async function () {

          })
          it('buy from WETH to WBTC', async function () {

          })
          it('buy from WETH to ZRX', async function () {

          })
          it('buy from WETH to 1INCH', async function () {

          })

          /// for WETH
          it('buy from WBTC to DAI', async function () {

          })
          it('buy from WBTC to USDC', async function () {

          })
          it('buy from WBTC to WETH', async function () {

          })
          it('buy from WBTC to ZRX', async function () {

          })
          it('buy from WBTC to 1INCH', async function () {

          })

          /// for WETH
          it('buy from ZRX to DAI', async function () {

          })
          it('buy from ZRX to USDC', async function () {

          })
          it('buy from ZRX to WETH', async function () {

          })
          it('buy from ZRX to WBTC', async function () {

          })
          it('buy from ZRX to 1INCH', async function () {

          })

          /// for 1INCH
          it('buy from 1INCH to DAI', async function () {

          })
          it('buy from 1INCH to USDC', async function () {

          })
          it('buy from 1INCH to WETH', async function () {

          })
          it('buy from 1INCH to WBTC', async function () {

          })
          it('buy from 1INCH to ZRX', async function () {

          })
    })
})