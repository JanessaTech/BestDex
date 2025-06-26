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

        it.skip('buy from DAI to WETH', async function () { //done
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

          it.skip('buy from DAI to WBTC', async function () { //done
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
        
            /* Check zrx balance before swap */ 
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

          it.skip('buy from DAI to ZRX', async function () { //done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai
            /* Connect to DAI and mint some tokens  */
            const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS)
            const ZRX = await ethers.getContractAt("IERC20", ZRX_ADDRESS) 

            const DAI_DECIMALS = 18
            const ZRX_DECIMALS = 18
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
        
            /* Check zrx balance before swap */
            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address);
            const zrxBalanceBefore = Number(hre.ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS));
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)
        
            /* Approve the swapper contract to spend DAI for me */
            await DAI.connect(signers[0]).approve(coreSwap.address, hre.ethers.utils.parseUnits("1", DAI_DECIMALS)); 
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("1", ZRX_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("1", DAI_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [ZRX_ADDRESS, feeTier, WETH_ADDRESS, feeTier, DAI_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(DAI_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 });
            swap.wait(); 
        
            /* Check DAI end balance */
            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address);
            const daiBalanceAfter = Number(hre.ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS));
            console.log('daiBalanceAfter = ', daiBalanceAfter)
        
            /* Check zrx balance after swap*/
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address);
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS));
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
          })

          it.skip('buy from DAI to 1INCH', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai
            /* Connect to DAI and mint some tokens  */
            const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS)
            const INCH = await ethers.getContractAt("IERC20", INCH_ADDRESS) 

            const DAI_DECIMALS = 18
            const INCH_DECIMALS = 18

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
        
            /* Check 1INCN balance before swap */
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address);
            const inchBalanceBefore = Number(hre.ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS));
            console.log('inchBalanceBefore = ', inchBalanceBefore)
        
            /* Approve the swapper contract to spend DAI for me */
            await DAI.connect(signers[0]).approve(coreSwap.address, hre.ethers.utils.parseUnits("1", DAI_DECIMALS)); 
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("1", INCH_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("1", DAI_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(DAI_ADDRESS, INCH_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 });
            swap.wait(); 
        
            /* Check DAI end balance */
            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address);
            const daiBalanceAfter = Number(hre.ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS));
            console.log('daiBalanceAfter = ', daiBalanceAfter)
        
            /* Check inch balance after swap*/
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address);
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS));
            console.log('inchBalanceAfter = ', inchBalanceAfter)
          })

          /// for USDC
          it.skip('buy from USDC to DAI', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const USDC_WHALE = '0x51edf02152ebfb338e03e30d65c15fbf06cc9ecc'
            const USDC_DECIMALS = 6
            const DAI_DECIMALS = 18
          
            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
            const DAI = await ethers.getContractAt('IERC20', DAI_ADDRESS)

            //Unlock USDC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [USDC_WHALE],
            });
            
            const usdcWhale = await ethers.getSigner(USDC_WHALE)
            await USDC.connect(usdcWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', USDC_DECIMALS))

            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
        
            /* Check dai balance before swap */
            const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address);
            const daiBalanceBefore = Number(hre.ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS));
            console.log('daiBalanceBefore = ', daiBalanceBefore)
        
            /* Approve the swapper contract to spend USDC for me */
            await USDC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', USDC_DECIMALS))
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("1", DAI_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", USDC_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(USDC_ADDRESS, DAI_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 });
            swap.wait(); 
        
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBlanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBlanceAfter = ', usdcBlanceAfter)

            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
            const daiBlanceAfter = Number(ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
            console.log('daiBlanceAfter = ', daiBlanceAfter)

          })
          it.skip('buy from USDC to WETH', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            const USDC_WHALE = '0x51edf02152ebfb338e03e30d65c15fbf06cc9ecc'
            const USDC_DECIMALS = 6
            const WETH_DECIMALS = 18

            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)

            //Unlock USDC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [USDC_WHALE],
            });
            
            const usdcWhale = await ethers.getSigner(USDC_WHALE)
            await USDC.connect(usdcWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', USDC_DECIMALS))

            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
        
            /* Check weth balance before swap */
            const wethBalanceBeforeSwap = await WETH.balanceOf(signers[0].address);
            const wethBalanceBefore = Number(hre.ethers.utils.formatUnits(wethBalanceBeforeSwap, WETH_DECIMALS));
            console.log('wethBalanceBefore = ', wethBalanceBefore)
        
            /* Approve the swapper contract to spend USDC for me */
            await USDC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', USDC_DECIMALS))
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("0.001", WETH_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", USDC_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(USDC_ADDRESS, WETH_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 });
            swap.wait(); 
        
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBlanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBlanceAfter = ', usdcBlanceAfter)

            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBalanceAfter= Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBalanceAfter = ', wethBalanceAfter)

          })
          it.skip('buy from USDC to WBTC', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const USDC_WHALE = '0x51edf02152ebfb338e03e30d65c15fbf06cc9ecc'
            const USDC_DECIMALS = 6
            const WBTC_DECIMALS = 8

            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)

            //Unlock USDC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [USDC_WHALE],
            });
            
            const usdcWhale = await ethers.getSigner(USDC_WHALE)
            await USDC.connect(usdcWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', USDC_DECIMALS))

            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
        
            /* Check wbtc balance before swap */
            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address);
            const wbtcBalanceBefore = Number(hre.ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS));
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)
        
            /* Approve the swapper contract to spend USDC for me */
            await USDC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', USDC_DECIMALS))
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("0.0001", WBTC_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", USDC_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(USDC_ADDRESS, WBTC_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 });
            swap.wait(); 
        
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBlanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBlanceAfter = ', usdcBlanceAfter)

            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter= Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          it.skip('buy from USDC to ZRX', async function () { //error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const USDC_WHALE = '0x51edf02152ebfb338e03e30d65c15fbf06cc9ecc'
            const USDC_DECIMALS = 6
            const ZRX_DECIMALS = 18
      
            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
      
            //Unlock USDC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [USDC_WHALE],
            });
            
            const usdcWhale = await ethers.getSigner(USDC_WHALE)
            await USDC.connect(usdcWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', USDC_DECIMALS))
      
            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)

            /* Approve the swapper contract to spend USDC for me */
            await USDC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', USDC_DECIMALS))

            /* Execute the swap */
            const amountOut = ethers.utils.parseUnits("0.1", ZRX_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", USDC_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [ZRX_ADDRESS, feeTier, WETH_ADDRESS, feeTier, USDC_ADDRESS]) 
            const swap = await coreSwap.swapExactOutputMultihop(USDC_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 }) 
            await swap.wait()
      
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBalanceAfter = ', usdcBalanceAfter)
      
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
          })
          it.skip('buy from USDC to 1INCH', async function () { //done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const USDC_WHALE = '0x51edf02152ebfb338e03e30d65c15fbf06cc9ecc'
            const USDC_DECIMALS = 6
            const INCH_DECIMALS = 18

            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS)

            //Unlock USDC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [USDC_WHALE],
            });
            
            const usdcWhale = await ethers.getSigner(USDC_WHALE)
            await USDC.connect(usdcWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', USDC_DECIMALS))

            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
        
            /* Check inch balance before swap */
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address);
            const inchBalanceBefore = Number(hre.ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS));
            console.log('inchBalanceBefore = ', inchBalanceBefore)
        
            /* Approve the swapper contract to spend USDC for me */
            await USDC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', USDC_DECIMALS))
        
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("1", INCH_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", USDC_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(USDC_ADDRESS, INCH_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 });
            swap.wait(); 
        
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBlanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBlanceAfter = ', usdcBlanceAfter)

            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter= Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
          })

          /// for WETH
          it.skip('buy from WETH to DAI', async function () { //done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
            const WETH_WHALE='0x3ee18B2214AFF97000D974cf647E7C347E8fa585';
            const DAI_DECIMALS = 18; 
            const WETH_DECIMALS = 18; 
            
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
      
            await WETH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', WETH_DECIMALS))
            
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("10000", DAI_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", WETH_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(WETH_ADDRESS, DAI_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
            const daiBlanceAfter = Number(ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
            console.log('daiBlanceAfter = ', daiBlanceAfter)
      
            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBlanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBlanceAfter = ', wethBlanceAfter)
          })

          it.skip('buy from WETH to USDC', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WETH_WHALE='0x3ee18B2214AFF97000D974cf647E7C347E8fa585';
            const WETH_DECIMALS = 18; 
            const USDC_DECIMALS = 6; 
            
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
      
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
      
            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
      
            await WETH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', WETH_DECIMALS))
            
            /* Execute the swap */
            const amountOut = hre.ethers.utils.parseUnits("10000", USDC_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", WETH_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(WETH_ADDRESS, USDC_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBalanceAfter = ', usdcBalanceAfter)
      
            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBlanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBlanceAfter = ', wethBlanceAfter)
          })

          it.skip('buy from WETH to WBTC', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WETH_WHALE='0x3ee18B2214AFF97000D974cf647E7C347E8fa585';
            const WETH_DECIMALS = 18; 
            const WBTC_DECIMALS = 8
      
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)
      
            //Unlock DAI whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [WETH_WHALE],
            });
            
            const wethWhale = await ethers.getSigner(WETH_WHALE)
            await WETH.connect(wethWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', WETH_DECIMALS))
      
            const wethBalanceBeforeSwap = await WETH.balanceOf(signers[0].address)
            const wethBalanceBefore = Number(ethers.utils.formatUnits(wethBalanceBeforeSwap, WETH_DECIMALS))
            console.log('wethBalanceBefore = ', wethBalanceBefore)

            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)
      
            await WETH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', WETH_DECIMALS))
            const amountOut = ethers.utils.parseUnits("0.1", WBTC_DECIMALS); 
            const amountInMaximum = hre.ethers.utils.parseUnits("10", WETH_DECIMALS);
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [WBTC_ADDRESS, feeTier, USDC_ADDRESS, feeTier, WETH_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(WETH_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 })
            await swap.wait()
      
            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBalanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBalanceAfter = ', wethBalanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          it.skip('buy from WETH to ZRX', async function () { //done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const WETH_WHALE='0x3ee18B2214AFF97000D974cf647E7C347E8fa585';
            const WETH_DECIMALS = 18; 
            const ZRX_DECIMALS = 18
            
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)

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

            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)

            await WETH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', WETH_DECIMALS))
            const amountOut = ethers.utils.parseUnits("10000", ZRX_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("10", WETH_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(WETH_ADDRESS, ZRX_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()

            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)

            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBlanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBlanceAfter = ', wethBlanceAfter)
          })

          it.skip('buy from WETH to 1INCH', async function () { //done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const WETH_WHALE='0x3ee18B2214AFF97000D974cf647E7C347E8fa585';
            
            const WETH_DECIMALS = 18; 
            const INCH_DECIMALS = 18
            
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS)
      
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
      
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)
      
            await WETH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', WETH_DECIMALS))
            const amountOut = ethers.utils.parseUnits("10000", INCH_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("10", WETH_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(WETH_ADDRESS, INCH_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
      
            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBlanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBlanceAfter = ', wethBlanceAfter)
          })

          /// for WETH
          it.skip('buy from WBTC to DAI', async function () {//error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const WBTC_WHALE = '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'
      
            const WBTC_DECIMALS = 8
            const DAI_DECIMALS = 18
            
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)
            const DAI = await ethers.getContractAt('IERC20', DAI_ADDRESS)
            
            //Unlock WBTC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [WBTC_WHALE],
            });
            
            const wbtcWhale = await ethers.getSigner(WBTC_WHALE)
            await WBTC.connect(wbtcWhale).transfer(signers[0].address, ethers.utils.parseUnits('0.1', WBTC_DECIMALS))
      
            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)

            const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address)
            const daiBalanceBefore = Number(ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS))
            console.log('daiBalanceBefore = ', daiBalanceBefore)
      
            await WBTC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('0.1', WBTC_DECIMALS))
            console.log('approved')
            const amountOut = ethers.utils.parseUnits("1000", DAI_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("0.1", WBTC_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [DAI_ADDRESS, feeTier, USDC_ADDRESS, feeTier, WBTC_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(WBTC_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 })
            await swap.wait()
            console.log('swap is done')
      
            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
            const daiBlanceAfter = Number(ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
            console.log('daiBlanceAfter = ', daiBlanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })
          it.skip('buy from WBTC to USDC', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WBTC_WHALE = '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'
            const WBTC_DECIMALS = 8
            const USDC_DECIMALS = 6
          
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)
            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
      
            //Unlock WBTC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [WBTC_WHALE],
            });
            
            const wbtcWhale = await ethers.getSigner(WBTC_WHALE)
            await WBTC.connect(wbtcWhale).transfer(signers[0].address, ethers.utils.parseUnits('0.1', WBTC_DECIMALS))
      
            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)

            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
      
            await WBTC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('0.1', WBTC_DECIMALS))
            const amountOut = ethers.utils.parseUnits("1000", USDC_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("0.1", WBTC_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(WBTC_ADDRESS, USDC_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBalanceAfter = ', usdcBalanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          it.skip('buy from WBTC to WETH', async function () { //error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const WBTC_WHALE = '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'
            
            const WBTC_DECIMALS = 8;
            const WETH_DECIMALS = 18; 
            
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
      
            //Unlock WBTC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [WBTC_WHALE],
            });
            
            const wbtcWhale = await ethers.getSigner(WBTC_WHALE)
            await WBTC.connect(wbtcWhale).transfer(signers[0].address, ethers.utils.parseUnits('1', WBTC_DECIMALS))
      
            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)

            const wethBalanceBeforeSwap = await WETH.balanceOf(signers[0].address)
            const wethBalanceBefore = Number(ethers.utils.formatUnits(wethBalanceBeforeSwap, WETH_DECIMALS))
            console.log('wethBalanceBefore = ', wethBalanceBefore)
      
            const approve = await WBTC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('1', WBTC_DECIMALS))
            await approve.wait()
            const amountOut = ethers.utils.parseUnits("1", WETH_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("1", WBTC_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [WETH_ADDRESS, feeTier, USDC_ADDRESS, feeTier, WBTC_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(WBTC_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 })
            await swap.wait()
      
            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBalanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBalanceAfter = ', wethBalanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          it.skip('buy from WBTC to ZRX', async function () {//error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const WBTC_WHALE = '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'
            
            const WBTC_DECIMALS = 8;
            const ZRX_DECIMALS = 18;  
            
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
      
            //Unlock WBTC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [WBTC_WHALE],
            });
            
            const wbtcWhale = await ethers.getSigner(WBTC_WHALE)
            await WBTC.connect(wbtcWhale).transfer(signers[0].address, ethers.utils.parseUnits('1', WBTC_DECIMALS))
      
            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)

            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)
      
            await WBTC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('1', WBTC_DECIMALS))
            const amountOut = ethers.utils.parseUnits("100000", ZRX_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("1", WBTC_DECIMALS);  
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address", "uint24", "address"], [ZRX_ADDRESS, feeTier, WETH_ADDRESS, feeTier, USDC_ADDRESS, feeTier, WBTC_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(WBTC_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 30000000 })
            await swap.wait()
      
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          it.skip('buy from WBTC to 1INCH', async function () { //error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const WBTC_WHALE = '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'
            
            const WBTC_DECIMALS = 8;
            const INCH_DECIMALS = 18
            
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS)
      
            //Unlock WBTC whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [WBTC_WHALE],
            });
            
            const wbtcWhale = await ethers.getSigner(WBTC_WHALE)
            await WBTC.connect(wbtcWhale).transfer(signers[0].address, ethers.utils.parseUnits('1', WBTC_DECIMALS))
      
            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)

            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)
      
            await WBTC.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('1', WBTC_DECIMALS))

            const amountOut = ethers.utils.parseUnits("100000", INCH_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("1", WBTC_DECIMALS);  
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [INCH_ADDRESS, feeTier, USDC_ADDRESS, feeTier, WBTC_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(WBTC_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 30000000 })
            await swap.wait()
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          /// for ZRX
          it.skip('buy from ZRX to DAI', async function () { //error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const ZRX_WHALE = '0x1743DFe7EEe92b75B18D4A876dB5027433f27440'
            
            const ZRX_DECIMALS = 18; 
            const DAI_DECIMALS = 18
      
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
            const DAI = await ethers.getContractAt('IERC20', DAI_ADDRESS)
            
      
            //Unlock ZRX whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [ZRX_WHALE],
            });
            
            const zrxWhale = await ethers.getSigner(ZRX_WHALE)
            await ZRX.connect(zrxWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', ZRX_DECIMALS))
      
            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)

            const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address)
            const daiBalanceBefore = Number(ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS))
            console.log('daiBalanceBefore = ', daiBalanceBefore)
      
            await ZRX.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', ZRX_DECIMALS))
            const amountOut = ethers.utils.parseUnits("1", DAI_DECIMALS);
            const amountInMaximum = ethers.utils.parseUnits("10", ZRX_DECIMALS);
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [DAI_ADDRESS, feeTier, WETH_ADDRESS, feeTier, ZRX_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(ZRX_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 }) 
            await swap.wait()
      
            const zrxcBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxcBalanceAfter = Number(ethers.utils.formatUnits(zrxcBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxcBalanceAfter = ', zrxcBalanceAfter)
      
            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
            const daiBlanceAfter = Number(ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
            console.log('daiBlanceAfter = ', daiBlanceAfter)
          })

          it.skip('buy from ZRX to USDC', async function () {//error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const ZRX_WHALE = '0x1743dfe7eee92b75b18d4a876db5027433f27440'
            
            const ZRX_DECIMALS = 18; 
            const USDC_DECIMALS = 6
      
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
            
            //Unlock ZRX whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [ZRX_WHALE],
            });
            
            const zrxWhale = await ethers.getSigner(ZRX_WHALE)
            await ZRX.connect(zrxWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', ZRX_DECIMALS))
      
            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)

            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
      
            await ZRX.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', ZRX_DECIMALS))
            const amountOut = ethers.utils.parseUnits("1", USDC_DECIMALS);
            const amountInMaximum = ethers.utils.parseUnits("10", ZRX_DECIMALS);
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [USDC_ADDRESS, feeTier, WETH_ADDRESS, feeTier, ZRX_ADDRESS]) 
            const swap = await coreSwap.swapExactOutputMultihop(ZRX_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 300000 }) 
            await swap.wait()
      
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBalanceAfter = ', usdcBalanceAfter)
      
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
          })

          it.skip('buy from ZRX to WETH', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const ZRX_WHALE = '0x1743dfe7eee92b75b18d4a876db5027433f27440';
            
            const ZRX_DECIMALS = 18;
            const WETH_DECIMALS = 18; 
           
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
            
            //Unlock ZRX whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [ZRX_WHALE],
            });
            const zrxWhale = await ethers.getSigner(ZRX_WHALE)
            await ZRX.connect(zrxWhale).transfer(signers[0].address, hre.ethers.utils.parseUnits("10", ZRX_DECIMALS))
      
            const wethBalanceBeforeSwap = await WETH.balanceOf(signers[0].address)
            const wethBalanceBefore = Number(ethers.utils.formatUnits(wethBalanceBeforeSwap, WETH_DECIMALS))
            console.log('wethBalanceBefore = ', wethBalanceBefore)
      
            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)
      
            await ZRX.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', ZRX_DECIMALS))
            const amountOut = ethers.utils.parseUnits("0.001", WETH_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("10", ZRX_DECIMALS);
            const swap = await coreSwap.swapExactOutput(ZRX_ADDRESS, WETH_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
      
            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBlanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBlanceAfter = ', wethBlanceAfter)
          })

          it.skip('buy from ZRX to WBTC', async function () {//error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'    
            const ZRX_WHALE = '0x1743dfe7eee92b75b18d4a876db5027433f27440';
            
            const ZRX_DECIMALS = 18; 
            const WBTC_DECIMALS = 8;
      
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS) 
      
            //Unlock ZRX whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [ZRX_WHALE],
            });
            
            const zrxWhale = await ethers.getSigner(ZRX_WHALE)
            await ZRX.connect(zrxWhale).transfer(signers[0].address, ethers.utils.parseUnits('1', ZRX_DECIMALS))
      
            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)

            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)
      
            await ZRX.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('1', ZRX_DECIMALS))
            const amountOut = ethers.utils.parseUnits("0.000001", WBTC_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("1", ZRX_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address", "uint24", "address"], [WBTC_ADDRESS, feeTier, USDC_ADDRESS, feeTier, WETH_ADDRESS, feeTier, ZRX_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(ZRX_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 30000000 })
            await swap.wait()
      
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          it.skip('buy from ZRX to 1INCH', async function () {//error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498'
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const ZRX_WHALE = '0x1743dfe7eee92b75b18d4a876db5027433f27440';
            
            const ZRX_DECIMALS = 18; 
            const INCH_DECIMALS = 18
      
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS) 
      
            //Unlock ZRX whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [ZRX_WHALE],
            });
            
            const zrxWhale = await ethers.getSigner(ZRX_WHALE)
            await ZRX.connect(zrxWhale).transfer(signers[0].address, ethers.utils.parseUnits('1', ZRX_DECIMALS))
      
            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)

            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)
      
            await ZRX.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('1', ZRX_DECIMALS))
            const amountOut = ethers.utils.parseUnits("0.1", INCH_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("1", ZRX_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [INCH_ADDRESS, feeTier, WETH_ADDRESS, feeTier, ZRX_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(ZRX_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 30000000 })
            await swap.wait()
      
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
          })

          /// for 1INCH
          it.skip('buy from 1INCH to DAI', async function () {//error, the result is unstable
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
            const INCH_WHALE = '0x6630444cdbd42a024da079615f3bbce8edd5a7ba'
      
            const INCH_DECIMALS = 18
            const DAI_DECIMALS = 18
      
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS)
            const DAI = await ethers.getContractAt('IERC20', DAI_ADDRESS)
            
            //Unlock INCH whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [INCH_WHALE],
            });
            
            const inchWhale = await ethers.getSigner(INCH_WHALE)
            await INCH.connect(inchWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', INCH_DECIMALS))
      
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)

            const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address)
            const daiBalanceBefore = Number(ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS))
            console.log('daiBalanceBefore = ', daiBalanceBefore)
      
            await INCH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', INCH_DECIMALS))
            const amountOut = ethers.utils.parseUnits("0.01", DAI_DECIMALS); // 0.1 sometimes is ok, 1 is not ok.
            const amountInMaximum = ethers.utils.parseUnits("10", INCH_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(INCH_ADDRESS, DAI_ADDRESS, amountOut,amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
            const daiBlanceAfter = Number(ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
            console.log('daiBlanceAfter = ', daiBlanceAfter)
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBlanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBlanceAfter = ', inchBlanceAfter)
          })

          it.skip('buy from 1INCH to USDC', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const INCH_WHALE = '0x6630444cdbd42a024da079615f3bbce8edd5a7ba'
      
            const INCH_DECIMALS = 18
            const USDC_DECIMALS = 6
      
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS)
            const USDC = await ethers.getContractAt('IERC20', USDC_ADDRESS)
            
            //Unlock INCH whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [INCH_WHALE],
            });
            
            const inchWhale = await ethers.getSigner(INCH_WHALE)
            await INCH.connect(inchWhale).transfer(signers[0].address, ethers.utils.parseUnits('1', INCH_DECIMALS))
      
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)

            const usdcBalanceBeforeSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceBefore = Number(ethers.utils.formatUnits(usdcBalanceBeforeSwap, USDC_DECIMALS))
            console.log('usdcBalanceBefore = ', usdcBalanceBefore)
      
            await INCH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('1', INCH_DECIMALS))

            const amountOut = ethers.utils.parseUnits("0.1", USDC_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("1", INCH_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(INCH_ADDRESS, USDC_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const usdcBalanceAfterSwap = await USDC.balanceOf(signers[0].address)
            const usdcBalanceAfter = Number(ethers.utils.formatUnits(usdcBalanceAfterSwap, USDC_DECIMALS))
            console.log('usdcBalanceAfter = ', usdcBalanceAfter)
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
          })

          it.skip('buy from 1INCH to WETH', async function () {//done
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302';
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const INCH_WHALE = '0x6630444cdbd42a024da079615f3bbce8edd5a7ba'
            
            const INCH_DECIMALS = 18
            const WETH_DECIMALS = 18; 
            
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS)
            const WETH = await ethers.getContractAt('IERC20', WETH_ADDRESS)
      
            //Unlock INCH whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [INCH_WHALE],
            });
            const inchWhale = await ethers.getSigner(INCH_WHALE)
            await INCH.connect(inchWhale).transfer(signers[0].address, hre.ethers.utils.parseUnits("10", INCH_DECIMALS))
      
            const weiBalanceBeforeSwap = await WETH.balanceOf(signers[0].address)
            const weiBalanceBefore = Number(ethers.utils.formatUnits(weiBalanceBeforeSwap, WETH_DECIMALS))
            console.log('weiBalanceBefore = ', weiBalanceBefore)
      
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)
      
            await INCH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', INCH_DECIMALS))
            
            const amountOut = ethers.utils.parseUnits("0.0001", WETH_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("10", INCH_DECIMALS); 
            const swap = await coreSwap.swapExactOutput(INCH_ADDRESS, WETH_ADDRESS, amountOut, amountInMaximum, mins, feeTier, { gasLimit: 300000 })
            await swap.wait()
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
      
            const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
            const wethBlanceAfter = Number(ethers.utils.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
            console.log('wethBlanceAfter = ', wethBlanceAfter)
          })

          it.skip('buy from 1INCH to WBTC', async function () {//error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302'
            const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
            const INCH_WHALE = '0x6630444cdbd42a024da079615f3bbce8edd5a7ba'
      
            const INCH_DECIMALS = 18
            const WBTC_DECIMALS = 8;
            
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS)
            const WBTC = await ethers.getContractAt('IERC20', WBTC_ADDRESS)
            
            //Unlock INCH whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [INCH_WHALE],
            });
            
            const inchWhale = await ethers.getSigner(INCH_WHALE)
            await INCH.connect(inchWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', INCH_DECIMALS))
      
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)

            const wbtcBalanceBeforeSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceBefore = Number(ethers.utils.formatUnits(wbtcBalanceBeforeSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceBefore = ', wbtcBalanceBefore)
      
            await INCH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', INCH_DECIMALS))

            const amountOut = ethers.utils.parseUnits("0.00001", WBTC_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("10", INCH_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [WBTC_ADDRESS, feeTier, USDC_ADDRESS, feeTier, INCH_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(INCH_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 30000000 })
            await swap.wait()
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
      
            const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
            const wbtcBalanceAfter = Number(ethers.utils.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
            console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
          })

          it.skip('buy from 1INCH to ZRX', async function () {//error
            const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
            const INCH_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302';
            const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
            const ZRX_ADDRESS = '0xe41d2489571d322189246dafa5ebde1f4699f498';
            const INCH_WHALE = '0x6630444cdbd42a024da079615f3bbce8edd5a7ba';
      
            const INCH_DECIMALS = 18
            const ZRX_DECIMALS = 18; 
            
            const INCH = await ethers.getContractAt('IERC20', INCH_ADDRESS) 
            const ZRX = await ethers.getContractAt('IERC20', ZRX_ADDRESS)
            
            //Unlock INCH whale
            await network.provider.request({
              method: "hardhat_impersonateAccount",
              params: [INCH_WHALE],
            });
            
            const inchWhale = await ethers.getSigner(INCH_WHALE)
            await INCH.connect(inchWhale).transfer(signers[0].address, ethers.utils.parseUnits('10', INCH_DECIMALS))
      
            const inchBalanceBeforeSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceBefore = Number(ethers.utils.formatUnits(inchBalanceBeforeSwap, INCH_DECIMALS))
            console.log('inchBalanceBefore = ', inchBalanceBefore)

            const zrxBalanceBeforeSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceBefore = Number(ethers.utils.formatUnits(zrxBalanceBeforeSwap, ZRX_DECIMALS))
            console.log('zrxBalanceBefore = ', zrxBalanceBefore)
      
            await INCH.connect(signers[0]).approve(coreSwap.address, ethers.utils.parseUnits('10', INCH_DECIMALS))

            const amountOut = ethers.utils.parseUnits("1", ZRX_DECIMALS); 
            const amountInMaximum = ethers.utils.parseUnits("10", INCH_DECIMALS); 
            const path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24", "address"], [ZRX_ADDRESS, feeTier, WETH_ADDRESS, feeTier, INCH_ADDRESS])
            const swap = await coreSwap.swapExactOutputMultihop(INCH_ADDRESS, path, amountOut, amountInMaximum, mins, { gasLimit: 30000000 })
            await swap.wait()
      
            const zrxBalanceAfterSwap = await ZRX.balanceOf(signers[0].address)
            const zrxBalanceAfter = Number(ethers.utils.formatUnits(zrxBalanceAfterSwap, ZRX_DECIMALS))
            console.log('zrxBalanceAfter = ', zrxBalanceAfter)
      
            const inchBalanceAfterSwap = await INCH.balanceOf(signers[0].address)
            const inchBalanceAfter = Number(ethers.utils.formatUnits(inchBalanceAfterSwap, INCH_DECIMALS))
            console.log('inchBalanceAfter = ', inchBalanceAfter)
          })
    })
})