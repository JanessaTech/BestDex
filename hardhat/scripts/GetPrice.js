const { JSBI }  = require("@uniswap/sdk")

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

function GetPrice() {
	let sqrtPriceX96 = '1903676691883830505273023940924';
	const tick = 63587
	let Decimal0 = 8;
	let Decimal1 = 6;

	const current_price = 1.0001 ** tick
	const adjusted_current_price =  current_price / (10 ** (Decimal1 - Decimal0))
	console.log('current_price(by tick) = ', current_price)
	console.log('adjusted_current_price(by tick) = ', adjusted_current_price)

    const buyOneOfToken0 = ((sqrtPriceX96 / 2**96)**2) / (10 ** (Decimal1 - Decimal0))
	const buyOneOfToken1 = (1 / buyOneOfToken0).toFixed(Decimal0);
	
	console.log("price of token0 in value of token1 (by sqrtPriceX96): " + buyOneOfToken0.toString());
	console.log("price of token1 in value of token0 (by sqrtPriceX96): " + buyOneOfToken1.toString());
}

GetPrice()

// run: npx hardhat run .\scripts\GetPrice.js\
// see references:
// 1. https://blog.uniswap.org/uniswap-v3-math-primer#how-do-i-calculate-the-current-exchange-rate