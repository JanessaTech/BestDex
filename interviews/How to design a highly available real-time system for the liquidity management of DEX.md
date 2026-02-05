**[Interviewer]** In order to design a highly available & real-time data service used to get UniswapV3Pool states, please describe:
1. The most critical real-time data: when user opens the liquidity management page
2. The source of data updating : which events trigger the updating?

**[Me]**. 1. The most critical real-time data: liquidity, tick and sqrtPriceX96 are the ones critical to render the liquidity management page
2. Swap, Mint, Burn and DecreaseLiquidity(defined In NonfungiblePositionManager)

**[Interviewer]** Good. You hit the core of DeFi integration: monitor the events on the chain and synchronzie the state on the off-chain. Let's start the design. Our aim is to evolve it into a "highly available real-time data service"
