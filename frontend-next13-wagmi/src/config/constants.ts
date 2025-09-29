import {parseAbi} from 'viem'
import { Decimal } from 'decimal.js'

export const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const READABLE_FORM_LEN = 4
export const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'
export const SwapRouter02ABI = parseAbi(['function multicall(uint256,bytes[]) payable returns (bytes[])'])
export const UNISWAP_ERRORS: Record<string, string> = {
    'TOO_LITTLE_RECEIVED': 'The received amount is less than the minimum',
    'INSUFFICIENT_OUTPUT_AMOUNT': 'Insufficient output amount',
    'INSUFFICIENT_LIQUIDITY': 'Insufficient liquidity',
    'EXPIRED': 'Transaction expired',
    'STF': 'Swap Transaction Failed',
  };

export const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function approve(address,uint256) returns (bool)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address,address,uint256) returns (bool)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
  'function transfer(address,uint256) returns (bool)',
  'function allowance(address,address) view returns (uint256)',
  'event Approval(address indexed,address indexed,uint256)',
  'event Transfer(address indexed,address indexed,uint256)',
  'event Deposit(address indexed,uint256)',
  'event Withdrawal(address indexed,uint256)'
])

export const MIN_TICK = -887272
export const MAX_TICK = 887272
export const TICK_RANG_PERCENTAGE = 0.1 
export const TICK_BASE = new Decimal(1.0001);
/**
 *  100 -> 100 / 1,000,000 = 0.0001 -> 0.01%
 *  500 -> 500 / 1,000,000 = 0.0005 -> 0.05%
    3000 -> 3000 / 1,000,000 = 0.003 -> 0.3%
    10000 -> 10000 / 1,000,000 = 0.01 -> 1%
 */
export const FEE_TIERS = [
    {value: 0.01, description: 'Best for very stable pairs.'}, 
    {value: 0.05, description: 'Best for stable pairs.'},
    {value: 0.3, description: 'Best for most pairs.'},
    {value: 1, description: 'Best for exotic pairs.'},
]

export const UNISWAP_V3_FACTORY_ADDRESSES: { [chainId: number]: `0x${string}`} = {
  1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
  137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon
  42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Arbitrum
  10: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Optimism
  42220: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc', // Celo
  11155111: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c', // Ethereum Sepolia
  31337: '0x1F98431c8aD98523631AE4a59f267346ea31F984'// same as Ethereum Mainnet since we are using forking mainnet as the local for test
};

export const UNISWAP_V3_FACTORY_ABI = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
]);

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const UNISWAP_V3_POSITION_MANAGER_ABI = parseAbi([
  'function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
  'function approve(address to, uint256 tokenId)',
  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
])