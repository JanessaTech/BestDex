import { TokenType } from "../../controllers/types"

export type Network_Enum = 'eth-mainnet' | 'arb-mainnet' | 'bnb-mainnet' | 'polygon-mainnet' | 'localhost' | 'testnet'
export type TokenListType = {chainId: number, network_enum: Network_Enum, tokens: TokenType[]}[]