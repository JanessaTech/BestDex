import {parseAbi} from 'viem'

export const TOKEN_PRICE_KEY = 'token_price'
export const TOKEN_PRICE_FETCH_INTERVAL = 60000 // 10 seconds
export const TOKEN_PRICE_REDIS_EXPIRY = 100 // 100 seconds

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

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

export const LISTENER_lOCAL_POLL_INTERVAL = 12000