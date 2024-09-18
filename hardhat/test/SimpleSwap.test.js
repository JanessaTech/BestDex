const { expect } = require("chai");
const { loadFixture } = require("ethereum-waffle");
const { ethers } = require("hardhat");

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18; 
const WETH_DECIMALS = 18; 
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 
const DAI_WHALE = "0xdDb108893104dE4E1C6d0E47c42237dB4E617ACc";// it has 3.62token in dai

const ercAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)"
];

describe("SimpleSwap", function () {
  async function sharedContractFixture() {
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap")
    const simpleSwapFactory = await SimpleSwapFactory.deploy(SwapRouterAddress)
    await simpleSwapFactory.deployed()
    const signers = await ethers.getSigners()
    const DAI = await ethers.getContractAt('IERC20', DAI_ADDRESS)
    const WETH = await ethers.getContractAt('IWETH9', WETH_ADDRESS)
    return {simpleSwapFactory, signers, DAI, WETH}
  }

  describe('swapExactInputSingle', function () {
    it.skip('should success when call swapExactInputSingle', async function () {
      const {simpleSwapFactory, signers, WETH, DAI} = await loadFixture(sharedContractFixture)
      const deposit = await WETH.connect(signers[0]).deposit({value: ethers.utils.parseEther('10')})
      await deposit.wait()

      const weiBalanceBeforeSwap = await WETH.balanceOf(signers[0].address)
      const weiBalanceBefore = Number(ethers.utils.formatUnits(weiBalanceBeforeSwap, WETH_DECIMALS))
      console.log('weiBalanceBefore = ', weiBalanceBefore)

      const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address)
      const daiBalanceBefore = Number(ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS))
      console.log('daiBalanceBefore = ', daiBalanceBefore)

      await WETH.connect(signers[0]).approve(simpleSwapFactory.address, ethers.utils.parseEther('1'))
      const amountIn = ethers.utils.parseEther("0.1"); 
      const swap = await simpleSwapFactory.swapExactInputSingle(amountIn, { gasLimit: 300000 })
      await swap.wait()

      const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
      const daiBlanceAfter = Number(ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
      console.log('daiBlanceAfter = ', daiBlanceAfter)

      const weiBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
      const weiBlanceAfter = Number(ethers.utils.formatUnits(weiBalanceAfterSwap, WETH_DECIMALS))
      console.log('weiBlanceAfter = ', weiBlanceAfter)
    })
  })

  describe('getPool', function () {
    it.skip('Check if pool exists', async function () {
      const {simpleSwapFactory, signers, WETH, DAI} = await loadFixture(sharedContractFixture)

      const exist = await simpleSwapFactory.getPool(WETH_ADDRESS, DAI_ADDRESS, 100)
      console.log('exist = ', exist)
    } )
  })

  it.skip("swapExactInputSingle", async function () {
    
    /* Deploy the SimpleSwap contract */
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    const simpleSwapFactory = await SimpleSwapFactory.deploy(SwapRouterAddress);
    let signers = await hre.ethers.getSigners();
    await simpleSwapFactory.deployed();//By default, deployments and function calls are done with the first configured account


    /* Connect to WETH and wrap some eth  */
    const WETH = new hre.ethers.Contract(WETH_ADDRESS, ercAbi, signers[0]);  // use the first account as msg.sender
    const deposit = await WETH.deposit({ value: hre.ethers.utils.parseEther("10") });
    await deposit.wait();
    
    /* Check Initial DAI Balance */ 
    const DAI = new hre.ethers.Contract(DAI_ADDRESS, ercAbi, signers[0]);  // use the first account as msg.sender
    const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].address);
    const DAIBalanceBefore = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceBefore, DAI_DECIMALS));
    console.log('DAIBalanceBefore = ', DAIBalanceBefore)

    /* Approve the swapper contract to spend WETH for me */
    await WETH.approve(simpleSwapFactory.address, hre.ethers.utils.parseEther("1"));  
    
    /* Execute the swap */
    const amountIn = hre.ethers.utils.parseEther("0.1"); 
    const swap = await simpleSwapFactory.swapExactInputSingle(amountIn, { gasLimit: 300000 });
    swap.wait(); 
    
    /* Check DAI end balance */
    const expandedDAIBalanceAfter = await DAI.balanceOf(signers[0].address);
    const DAIBalanceAfter = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceAfter, DAI_DECIMALS));
    console.log('DAIBalanceAfter = ', DAIBalanceAfter)
    
    expect(DAIBalanceAfter).to.be.greaterThan(DAIBalanceBefore); 
  });

  it.skip('swapExactOutputSingle', async function () {
    const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
    const simpleSwapFactory = await SimpleSwapFactory.deploy(SwapRouterAddress);
    let signers = await hre.ethers.getSigners();
    await simpleSwapFactory.deployed();

    /* Connect to DAI and mint some tokens  */
    const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS)
    //Unlock DAI whale
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
    const daiWhale = await ethers.getSigner(DAI_WHALE)
    await DAI.connect(daiWhale).transfer(signers[0].address, hre.ethers.utils.parseEther("1"))

    /* Check DAI Balance before swap */ 
    const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address);
    const daiBalanceBefore = Number(hre.ethers.utils.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS));
    console.log('daiBalanceBeforeSwap = ', daiBalanceBeforeSwap)
    console.log('daiBalanceBefore = ', daiBalanceBefore)

    /* Check wei balance before swap */
    const WETH = await ethers.getContractAt("IERC20", WETH_ADDRESS)  
    const weiBalanceBeforeSwap = await WETH.balanceOf(signers[0].address);
    const weiBalanceBefore = Number(hre.ethers.utils.formatUnits(weiBalanceBeforeSwap, WETH_DECIMALS));
    console.log('weiBalanceBeforeSwap = ', weiBalanceBeforeSwap)
    console.log('weiBalanceBefore = ', weiBalanceBefore)

    /* Approve the swapper contract to spend DAI for me */
    await DAI.connect(signers[0]).approve(simpleSwapFactory.address, hre.ethers.utils.parseEther("1")); 

    /* Execute the swap */
    const amountOut = hre.ethers.utils.parseEther("0.0001"); 
    const amountInMaximum = hre.ethers.utils.parseEther("1"); 
    const swap = await simpleSwapFactory.swapExactOutputSingle(amountOut, amountInMaximum, { gasLimit: 300000 });
    swap.wait(); 

    /* Check DAI end balance */
    const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address);
    const daiBalanceAfter = Number(hre.ethers.utils.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS));
    console.log('daiBalanceAfter = ', daiBalanceAfter)

    /* Check wei balance after swap*/
    const weiBalanceAfterSwap = await WETH.balanceOf(signers[0].address);
    const weiBalanceAfter = Number(ethers.utils.formatUnits(weiBalanceAfterSwap, DAI_DECIMALS));
    console.log('weiBalanceAfter = ', weiBalanceAfter)
  })
});
