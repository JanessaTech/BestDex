// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol";
import "hardhat/console.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityExamples is IERC721Receiver {
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    // 0.01% fee
    uint24 public constant poolFee = 100;

    INonfungiblePositionManager public nonfungiblePositionManager = 
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    IUniswapV3Factory public uniswapV3Factory = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);

    /// @notice Represents the deposit of an NFT
    struct Deposit {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
    }
    /// @dev deposits[tokenId] => Deposit
    mapping(uint => Deposit) public deposits;

    // Store token id used in this example
    uint public tokenId;

    // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
    function onERC721Received(
        address operator,
        address,
        uint _tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        _createDeposit(operator, _tokenId);
        return this.onERC721Received.selector;
    }

    function _createDeposit(address owner, uint _tokenId) internal {
       (, , address token0, address token1, , , , uint128 liquidity, , , , ) =
            nonfungiblePositionManager.positions(_tokenId);
        // set the owner and data for position
        // operator is msg.sender
        deposits[_tokenId] = Deposit({
            owner: owner,
            liquidity: liquidity,
            token0: token0,
            token1: token1
        });

        console.log("Token id", _tokenId);
        console.log("Liquidity", liquidity);
        console.log('owner:', owner);

        tokenId = _tokenId;
    }

    function mintNewPosition()
        external
        returns (
            uint _tokenId,
            uint128 liquidity,
            uint amount0,
            uint amount1
        )
    {
        // For this example, we will provide equal amounts of liquidity in both assets.
        // Providing liquidity in both assets means liquidity will be earning fees and is considered in-range.
        uint amount0ToMint = 2 * 1e18;
        uint amount1ToMint = 2 * 1e6;

        // Approve the position manager
        TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), amount0ToMint);
        TransferHelper.safeApprove(USDC, address(nonfungiblePositionManager), amount1ToMint);

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: DAI,
                token1: USDC,
                fee: poolFee,
                // By using TickMath.MIN_TICK and TickMath.MAX_TICK, 
                // we are providing liquidity across the whole range of the pool. 
                // Not recommended in production.
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: amount0ToMint,
                amount1Desired: amount1ToMint,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            });

        // Note that the pool defined by DAI/USDC and fee tier 0.01% must 
        // already be created and initialized in order to mint
        (_tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager
            .mint(params);
        console.log("minted liquidity", liquidity);
        // Create a deposit
        _createDeposit(msg.sender, _tokenId);

        // Remove allowance and refund in both assets.
        if (amount0 < amount0ToMint) {
            TransferHelper.safeApprove(
                DAI,
                address(nonfungiblePositionManager),
                0
            );
            uint refund0 = amount0ToMint - amount0;
            TransferHelper.safeTransfer(DAI, msg.sender, refund0);
        }

        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(
                USDC,
                address(nonfungiblePositionManager),
                0
            );
            uint refund1 = amount1ToMint - amount1;
            TransferHelper.safeTransfer(USDC, msg.sender, refund1);
        }
    }

    function increaseLiquidityCurrentRange(
        uint256 amountAdd0,
        uint256 amountAdd1
    )
        external
        returns (
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), amountAdd0);
        TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), amountAdd1);

        TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), amountAdd0);
        TransferHelper.safeApprove(USDC, address(nonfungiblePositionManager), amountAdd1);

        INonfungiblePositionManager.IncreaseLiquidityParams memory params =
            INonfungiblePositionManager.IncreaseLiquidityParams({
                tokenId: tokenId,
                amount0Desired: amountAdd0,
                amount1Desired: amountAdd1,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        (liquidity, amount0, amount1) = nonfungiblePositionManager.increaseLiquidity(params);

        console.log("added liquidity", liquidity);
        console.log("amount 0:", amount0);
        console.log("amount 1:", amount1);

        // Remove allowance and refund in both assets.
        if (amount0 < amountAdd0) {
            TransferHelper.safeApprove(
                DAI,
                address(nonfungiblePositionManager),
                0
            );
            uint refund0 = amountAdd0 - amount0;
            TransferHelper.safeTransfer(DAI, msg.sender, refund0);
        }

        if (amount1 < amountAdd1) {
            TransferHelper.safeApprove(
                USDC,
                address(nonfungiblePositionManager),
                0
            );
            uint refund1 = amountAdd1 - amount1;
            TransferHelper.safeTransfer(USDC, msg.sender, refund1);
        }
    }

    function decreaseLiquidity(uint128 liquidity) external returns (uint amount0, uint amount1) {
        INonfungiblePositionManager.DecreaseLiquidityParams memory params =
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        nonfungiblePositionManager.decreaseLiquidity(params);
        console.log("removed liquidity", liquidity);
        
        (amount0, amount1) = nonfungiblePositionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );
        console.log("amount 0:", amount0);
        console.log("amount 1:", amount1);
        _sendToOwner(tokenId, amount0, amount1);
    }

    function _sendToOwner(
        uint256 _tokenId,
        uint256 amount0,
        uint256 amount1
    ) internal {
        // get owner of contract
        address owner = deposits[_tokenId].owner;

        address token0 = deposits[_tokenId].token0;
        address token1 = deposits[_tokenId].token1;
        // send collected fees to owner
        console.log('_sendToOwner - owner:', owner);
        console.log('amount0:', amount0);
        console.log('amount1:', amount1);
        console.log('amount0 before transfer:', IERC20(token0).balanceOf(owner));
        console.log('amount1 before transfer:',IERC20(token1).balanceOf(owner));
        TransferHelper.safeTransfer(token0, owner, amount0);
        TransferHelper.safeTransfer(token1, owner, amount1);
        console.log('amount0 after transfer:', IERC20(token0).balanceOf(owner));
        console.log('amount1 after transfer:',IERC20(token1).balanceOf(owner));
    }

    function getLiquidity(uint _tokenId) external view returns (uint128) {
        (, , , , , , , uint128 liquidity, , , , ) =
            nonfungiblePositionManager.positions(_tokenId);
        return liquidity;
    }
}