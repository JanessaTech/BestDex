import {parseAbi} from 'viem'
import { Decimal } from 'decimal.js'

export const READABLE_FORM_LEN = 4

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

export const UNISWAP_V3_FACTORY_ADDRESSES: { [chainId: number]: `0x${string}`} = {
  1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
  8453: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD', // Base,
  56: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7', // BNB Smart Chain,
  137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon
  42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Arbitrum
  42220: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc', // Celo
  43114: '0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD', //Avalanche
  81457: '0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd', //blast mainnet
  130: '0x1f98400000000000000000000000000000000003',//Unichain
  480: '0x7a5028BDa40e7B173C278C5342087826455ea25a', //WorldChain
  324: '0x8FdA5a7a8dCA67BBcDd10F02Fa0649A937215422',//ZKsync
  7777777: '0x7145F8aeef1f6510E92164038E1B6F8cB2c42Cbb', //Zora
  // below are for testnets
  11155111: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c', // Ethereum Sepolia
  84532: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', // Base Sepolia
  421614: '0x248AB79Bbb9bC29bB72f7Cd42F17e054Fc40188e', //Arbitrum-sepolia
  11142220: '0x229Fd76DA9062C1a10eb4193768E192bdEA99572', //celo sepolia
  1301: '0x1F98431c8aD98523631AE4a59f267346ea31F984', //Unichain Sepolia
  999999999: '0x4324A677D74764f46f33ED447964252441aA8Db6', //Zora Sepolia
  //for local test
  31337: '0x1F98431c8aD98523631AE4a59f267346ea31F984'// same as Ethereum Mainnet since we are using forking mainnet as the local for test
};
export const V3_SWAP_ROUTER_ADDRESS: { [chainId: number]: `0x${string}`} = {
  1: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', // Ethereum Mainnet
  8453: '0x2626664c2603336E57B271c5C0b26F421741e481', // Base,
  56: '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2', // BNB Smart Chain,
  137: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', // Polygon
  42161: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', // Arbitrum
  42220: '0x5615CDAb10dc425a742d643d949a7F474C01abc4', // Celo
  43114: '0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE', //Avalanche
  81457: '0x549FEB8c9bd4c12Ad2AB27022dA12492aC452B66', //blast mainnet
  130: '0x73855d06de49d0fe4a9c42636ba96c62da12ff9c',//Unichain
  480: '0x091AD9e2e6e5eD44c1c66dB50e49A601F9f36cF6', //WorldChain
  324: '0x99c56385daBCE3E81d8499d0b8d0257aBC07E8A3',//ZKsync
  7777777: '0x7De04c96BE5159c3b5CeffC82aa176dc81281557', //Zora
  // below are for testnets
  11155111: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E', // Ethereum Sepolia
  84532: '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4', // Base Sepolia
  421614: '0x101F443B4d1b059569D643917553c771E1b9663E', //Arbitrum-sepolia
  11142220: '0x8C456F41A3883bA0ba99f810F7A2Da54D9Ea3EF0', //celo sepolia
  1301: '0xd1AAE39293221B77B0C71fBD6dCb7Ea29Bb5B166', //Unichain Sepolia
  999999999: '0x6B36d761981d82B1e07cF3c4daF4cB4615c4850a', //Zora Sepolia
  //for local test
  31337: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'// same as Ethereum Mainnet since we are using forking mainnet as the local for test
}

export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: { [chainId: number]: `0x${string}`} = {
  1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Ethereum Mainnet
  8453: '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1', // Base,
  56: '0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613', // BNB Smart Chain,
  137: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Polygon
  42161: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Arbitrum
  42220: '0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A', // Celo
  43114: '0x655C406EBFa14EE2006250925e54ec43AD184f8B', //Avalanche
  81457: '0xB218e4f7cF0533d4696fDfC419A0023D33345F28', //blast mainnet
  130: '0x943e6e07a7e8e791dafc44083e54041d743c46e9',//Unichain
  480: '0xec12a9F9a09f50550686363766Cc153D03c27b5e', //WorldChain
  324: '0x0616e5762c1E7Dc3723c50663dF10a162D690a86',//ZKsync
  7777777: '0xbC91e8DfA3fF18De43853372A3d7dfe585137D78', //Zora
  // below are for testnets
  11155111: '0x1238536071E1c677A632429e3655c799b22cDA52', // Ethereum Sepolia
  84532: '0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2', // Base Sepolia
  421614: '0x6b2937Bde17889EDCf8fbD8dE31C3C2a70Bc4d65', //Arbitrum-sepolia
  11142220: '0x0eC9d3C06Bc0A472A80085244d897bb604548824', //celo sepolia
  1301: '0xB7F724d6dDDFd008eFf5cc2834edDE5F9eF0d075', //Unichain Sepolia
  999999999: '0xB8458EaAe43292e3c1F7994EFd016bd653d23c20', //Zora Sepolia
  //for local test
  31337: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'// same as Ethereum Mainnet since we are using forking mainnet as the local for test
}

export const UNISWAP_V3_FACTORY_ABI = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
]);

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const UNISWAP_V3_POSITION_MANAGER_ABI = parseAbi([
  'function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
  'function increaseLiquidity((uint256 tokenId, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, uint256 deadline) params) payable returns (uint128 liquidity, uint256 amount0, uint256 amount1)',
  'function collect((uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max) params) payable returns (uint256 amount0, uint256 amount1)',
  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
  'function multicall(bytes[] data) payable returns (bytes[] results)',
])

export const UNISWAP_V3_POSITION_MANAGER_INCREASE_LIQUIDITY_ABI = parseAbi([
  'event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
])
export const UNISWAP_V3_POSITION_MANAGER_DECREASE_LIQUIDITY_ABI = parseAbi([
  'event DecreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
])
export const UNISWAP_V3_POSITION_MANAGER_COLLECT_LIQUIDITY_ABI = parseAbi([
  'event Collect(uint256 indexed tokenId, address recipient, uint256 amount0, uint256 amount1)',
])
export const UNISWAP_V3_POOL_SWAP_ABI = parseAbi([
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)'
])

export const PAGE_SIZE = 50
export const PAGE_LOAD_SKETETON_SPAN = 100
export enum CHANNELS {
  POOLINFO = 'POOLINFO'
}
export const PRICE_INTERVAL = 10000
