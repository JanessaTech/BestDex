const { expect } = require("chai");
const { ethers } = require("hardhat");
const {loadFixture, time} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 

const erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function approve(address,uint256) returns (bool)",
    "function transfer(address, uint256) returns (bool)"
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
    "function approve(address,uint256) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)"
  ];

describe('', function () {
    async function sharedContractFixture() {
        const coreSwapFactory = await ethers.getContractFactory('CoreSwap')
        const coreSwap = await coreSwapFactory.deploy(SwapRouterAddress)
        await coreSwap.waitForDeployment()
        const signers = await ethers.getSigners()
        const mins = 30
        const feeTier = 3000; // For simplicity, choose 0.3% for all of token pairs
        const abiCoder = new ethers.AbiCoder();
        return {coreSwap, signers, mins, feeTier, abiCoder}
    }

    it.skip('sell from DAI to WETH', async function () { //done
        const {coreSwap, signers, mins, feeTier} = await loadFixture(sharedContractFixture)
        const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
        const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        const DAI_WHALE = '0xD1668fB5F690C59Ab4B0CAbAd0f8C1617895052B'
        const DAI_DECIMALS = 18
        const WETH_DECIMALS = 18
  
        const DAI = new ethers.Contract(DAI_ADDRESS, daiAbi, ethers.provider)
        const WETH = new ethers.Contract(WETH_ADDRESS, weiAbi, ethers.provider)
  
        //Unlock DAI whale
        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [DAI_WHALE],
        });
        
        const daiWhale = await ethers.getSigner(DAI_WHALE)
        await DAI.connect(daiWhale).transfer(signers[0].address, ethers.parseUnits('10', DAI_DECIMALS))
  
        const daiBalanceBeforeSwap = await DAI.balanceOf(signers[0].address)
        const daiBalanceBefore = Number(ethers.formatUnits(daiBalanceBeforeSwap, DAI_DECIMALS))
        console.log('daiBalanceBefore = ', daiBalanceBefore)
  
        await DAI.connect(signers[0]).approve(coreSwap.getAddress(), ethers.parseUnits('1', DAI_DECIMALS))
        const amountIn = ethers.parseUnits("0.1", DAI_DECIMALS); 
        const swap = await coreSwap.swapExactInput(DAI_ADDRESS, WETH_ADDRESS, amountIn, mins, feeTier, { gasLimit: 300000 })
        await swap.wait()
  
        const daiBalanceAfterSwap = await DAI.balanceOf(signers[0].address)
        const daiBlanceAfter = Number(ethers.formatUnits(daiBalanceAfterSwap, DAI_DECIMALS))
        console.log('daiBlanceAfter = ', daiBlanceAfter)
  
        const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
        const wethBlanceAfter = Number(ethers.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
        console.log('wethBlanceAfter = ', wethBlanceAfter)
    })

    it('sell from WETH to WBTC', async function () { //done
        const {coreSwap, signers, mins, feeTier, abiCoder} = await loadFixture(sharedContractFixture)
        const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        const WETH_WHALE='0x3ee18B2214AFF97000D974cf647E7C347E8fa585';
        const WETH_DECIMALS = 18; 
        const WBTC_DECIMALS = 8
  
        const WETH = new ethers.Contract(WETH_ADDRESS, erc20Abi, ethers.provider)
        const WBTC = new ethers.Contract(WBTC_ADDRESS, erc20Abi, ethers.provider)

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [WETH_WHALE],
        });
        
        const wethWhale = await ethers.getSigner(WETH_WHALE)
        await WETH.connect(wethWhale).transfer(signers[0].address, ethers.parseUnits('10', WETH_DECIMALS))
  
        const wethBalanceBeforeSwap = await WETH.balanceOf(signers[0].address)
        const wethBalanceBefore = Number(ethers.formatUnits(wethBalanceBeforeSwap, WETH_DECIMALS))
        console.log('wethBalanceBefore = ', wethBalanceBefore)
  
        await WETH.connect(signers[0]).approve(coreSwap.getAddress(), ethers.parseUnits('1', WETH_DECIMALS))
        const amountIn = ethers.parseUnits("0.1", WETH_DECIMALS); 
        const path = ethers.solidityPacked(["address", "uint24", "address", "uint24", "address"],
            [
              ethers.getAddress(WETH_ADDRESS),
              feeTier,
              ethers.getAddress(USDC_ADDRESS),
              feeTier, 
              ethers.getAddress(WBTC_ADDRESS)
            ]
           )
        console.log(path)
        const swap = await coreSwap.swapExactInputMultihop(WETH_ADDRESS, path, amountIn, mins, { gasLimit: 300000 })
        await swap.wait()
  
        const wethBalanceAfterSwap = await WETH.balanceOf(signers[0].address)
        const wethBalanceAfter = Number(ethers.formatUnits(wethBalanceAfterSwap, WETH_DECIMALS))
        console.log('wethBalanceAfter = ', wethBalanceAfter)
  
        const wbtcBalanceAfterSwap = await WBTC.balanceOf(signers[0].address)
        const wbtcBalanceAfter = Number(ethers.formatUnits(wbtcBalanceAfterSwap, WBTC_DECIMALS))
        console.log('wbtcBalanceAfter = ', wbtcBalanceAfter)
      })
})