// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "hardhat/console.sol";

contract CoreSwap {
    ISwapRouter public immutable swapRouter;
    IUniswapV3Factory public uniswapV3Factory = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);

	constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapExactInput(address token0, address token1, uint amountIn, uint256 mins, uint24 feeTier) 
        external returns (uint256 amountOut) {
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
        console.log('amountOut = ', amountOut);
        return amountOut;
    }

    function swapExactInputMultihop(address token0, bytes memory path, uint256 amountIn, uint256 mins) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(token0, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(token0, address(swapRouter), amountIn);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: path,
                recipient: msg.sender,
                deadline: block.timestamp + mins * 60,
                amountIn: amountIn,
                amountOutMinimum: 0
            });
        amountOut = swapRouter.exactInput(params);
        console.log('amountOut = ', amountOut);
        return amountOut;
    }

}