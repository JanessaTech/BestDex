import {parseAbi} from 'viem'

export const TOKEN_PRICE_KEY = 'token_price'
export const TOKEN_PRICE_FETCH_INTERVAL = 60000 // 10 seconds
export const TOKEN_PRICE_REDIS_EXPIRY = 100 // 100 seconds

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const UNISWAP_V3_POSITION_MANAGER_ABI = parseAbi([
  'function balanceOf(address _owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
])


export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: { [chainId: number]: `0x${string}`} = {
  1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Ethereum Mainnet
  8453: '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1', // Base,
  56: '0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613', // BNB Smart Chain,
  137: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Polygon
  42161: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Arbitrum
  10: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Optimism
  42220: '0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A', // Celo
  43114: '0x655C406EBFa14EE2006250925e54ec43AD184f8B', //Avalanche
  81457: '0xB218e4f7cF0533d4696fDfC419A0023D33345F28', //blast mainnet
  143: '0x7197e214c0b767cfb76fb734ab638e2c192f4e53', //monad mainnet
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

export const THEGRAPH_ENDPOINTS :  { [chainId: number]: string} = {
  1: 'https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV', // Ethereum Mainnet
  8453: 'https://gateway.thegraph.com/api/subgraphs/id/HMuAwufqZ1YCRmzL2SfHTVkzZovC9VL2UAKhjvRqKiR1', // Base
  56: 'https://gateway.thegraph.com/api/subgraphs/id/G5MUbSBM7Nsrm9tH2tGQUiAF4SZDGf2qeo1xPLYjKr7K', // BNB Smart Chain,
  137: '', // Polygon
  42161: 'https://gateway.thegraph.com/api/subgraphs/id/3V7ZY6muhxaQL5qvntX1CFXJ32W7BxXZTGTwmpH5J4t3', // Arbitrum
  10: '', // Optimism
  42220: '', // Celo
  11155111: 'https://gateway.thegraph.com/api/subgraphs/id/EDJCBpDBGBajTP1x3qLGLg3ZaVR5Q2TkNxyNHdCuryex', // Ethereum Sepolia
  84532: '', // Base Sepolia
}

export const UNISWAP_V3_FACTORY_ADDRESSES: { [chainId: number]: `0x${string}`} = {
  1: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Ethereum Mainnet
  8453: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD', // Base,
  56: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7', // BNB Smart Chain,
  137: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Polygon
  42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Arbitrum
  10: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Optimism
  42220: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc', // Celo
  43114: '0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD', //Avalanche
  81457: '0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd', //blast mainnet
  143: '0x204faca1764b154221e35c0d20abb3c525710498', //monad mainnet
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

export const UNISWAP_V3_FACTORY_ABI = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
]);

export const POSITION_REDIS_EXPIRY = 3600 // 60 mins
export const LISTENER_lOCAL_POLL_INTERVAL = 12000
export enum TRANSACTION_TYPE {
  Swap = 'Swap',
  Mint = 'Mint',
  Increase = 'Increase',
  Decrease = 'Decrease',
  Collect = 'Collect'
}

export enum CHANNELS {
  POOLINFO = 'POOLINFO'
}