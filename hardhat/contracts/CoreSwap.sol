// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "hardhat/console.sol";

contract CoreSwap {
    ISwapRouter public immutable swapRouter;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    IUniswapV3Factory public uniswapV3Factory = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);
    uint24 public constant feeTier = 3000;

	constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapExactInput(address token0, address token1, uint amountIn, uint256 mins) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(token0, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(token0, address(swapRouter), amountIn);
        ISwapRouter.ExactInputSingleParams memory params =
        ISwapRouter.ExactInputSingleParams({
          tokenIn: token0,
          tokenOut: token1,
          fee: feeTier,
          recipient: msg.sender,
          deadline: block.timestamp + mins * 60,
          amountIn: amountIn,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0
        });
        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
        return amountOut;
    }

    function swapExactOutput(address token0, address token1, uint256 amountOut, uint256 amountInMaximum, uint256 mins) external returns (uint256 amountIn) {
        TransferHelper.safeTransferFrom(token0, msg.sender, address(this), amountInMaximum);
        TransferHelper.safeApprove(token0, address(swapRouter), amountInMaximum);
        ISwapRouter.ExactOutputSingleParams memory params =
                ISwapRouter.ExactOutputSingleParams({
                    tokenIn: token0,
                    tokenOut: token1,
                    fee: feeTier,
                    recipient: msg.sender,
                    deadline: block.timestamp + mins * 60,
                    amountOut: amountOut,
                    amountInMaximum: amountInMaximum,
                    sqrtPriceLimitX96: 0
                });
        amountIn = swapRouter.exactOutputSingle(params);
        console.log('amountIn = ', amountIn);
        if (amountIn < amountInMaximum) {
                TransferHelper.safeApprove(token0, address(swapRouter), 0);
                TransferHelper.safeTransfer(token0, msg.sender, amountInMaximum - amountIn);
        }
    }
  
  function getPool(address _tokenA, address _tokenB, uint24 _fee) external view returns (address pool) {
        address _pool = uniswapV3Factory.getPool(_tokenA, _tokenB, _fee);
        console.log("pool:", _pool);
        return _pool;
  }
}