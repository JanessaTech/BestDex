import {parseAbi} from 'viem'

export const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const READABLE_FORM_LEN = 4
export const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
export const SwapRouter02ABI = parseAbi(['function multicall(uint256,bytes[]) payable returns (bytes[])'])
export const UNISWAP_ERRORS: Record<string, string> = {
    'TOO_LITTLE_RECEIVED': 'The received amount is less than the minimum',
    'INSUFFICIENT_OUTPUT_AMOUNT': 'Insufficient output amount',
    'INSUFFICIENT_LIQUIDITY': 'Insufficient liquidity',
    'EXPIRED': 'Transaction expired',
    'STF': 'Swap Transaction Failed',
  };