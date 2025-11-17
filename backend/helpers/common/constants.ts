import {parseAbi} from 'viem'

export const TOKEN_PRICE_KEY = 'token_price'
export const TOKEN_PRICE_FETCH_INTERVAL = 1800000 // 10 seconds
export const TOKEN_PRICE_REDIS_EXPIRY = 100 // 100 seconds

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const UNISWAP_V3_POSITION_MANAGER_ABI = parseAbi([
  'function balanceOf(address _owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
])

export const UNISWAP_V3_POSITION_MANAGER_CONTRACT_ADDRESSES: { [chainId: number]: `0x${string}`} = {
  1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Ethereum Mainnet
  137: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Polygon
  42161: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Arbitrum
  10: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Optimism
  42220: '0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A', // Celo
  11155111: '0x1238536071E1c677A632429e3655c799b22cDA52', // Ethereum Sepolia
  31337: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // same as Ethereum Mainnet since we are using forking mainnet as the local for test
}

export const THEGRAPH_ENDPOINTS :  { [chainId: number]: string} = {
  1: 'https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV' // Ethereum Mainnet
}

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

export const POSITION_REDIS_EXPIRY = 3600 // 60 mins
export const LISTENER_lOCAL_POLL_INTERVAL = 12000