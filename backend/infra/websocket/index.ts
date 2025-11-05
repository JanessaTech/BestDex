import { calcPoolAddress } from "../utils/Pool"
import logger from '../../helpers/logger'
import { TokenType } from "../types/TypesInInfra"
import UniswapV3PoolListener from "./UniswapV3PoolListener"
import LocalUniswapV3PoolListener from "./LocalUniswapV3PoolListener"
import { FEE_TIERS, chainUrls, tokenList } from "../../config/data/hardcode"
import { PublicClient } from 'viem'
import { createBlockchainClient } from "../utils/Chain"

const listenersMap: Map<number, Map<`0x${string}`, UniswapV3PoolListener | LocalUniswapV3PoolListener>> = new Map([])

const addWebSocketListener = async (token0 : TokenType, token1: TokenType, feeAmount: number, publicClient: PublicClient) => {
    let poolAddress = undefined
    const chainId = await publicClient.getChainId()
    try {
        poolAddress = await calcPoolAddress(token0.address, token1.address, feeAmount, chainId, publicClient)
        logger.debug(`poolAddress=${poolAddress}, token0=${token0.symbol}, token1=${token1.symbol}, chainId=${chainId} ,feeAmount=${feeAmount}`)
    } catch (error) {
        logger.error('poolAddress is invalid due to:', error)
        throw new Error('Invalid pool address')
    }
    let found = chainUrls.get(chainId)
    if (!found) {
        logger.error(`No found wss url for ${chainId}`)
        throw new Error(`No found wss url for ${chainId}`)
    }
    const wssURL = found[2]

    logger.debug(`poolAddress =${poolAddress}, wssURL=${wssURL}`)
    if (!listenersMap.get(chainId)?.get(poolAddress)) { // add listener only when no listener
        let listener!: UniswapV3PoolListener | LocalUniswapV3PoolListener
        if (chainId === 31337) { //for test
            listener = new LocalUniswapV3PoolListener(poolAddress, wssURL, publicClient)
        } else {
            listener = new UniswapV3PoolListener(poolAddress, wssURL, publicClient)
        }
        if (!listenersMap.has(chainId)) {
            listenersMap.set(chainId, new Map())
        }
        listenersMap.get(chainId)?.set(poolAddress, listener)
        logger.info('A new listener is added!')
    } else {
        logger.info('A new listener was already added!')
    }
}


const addAllWebSocketListeners = async (chainId: number) => {
    logger.info('Add all websocket listeners for chainId: ', chainId)
    const publicClient = createBlockchainClient(chainId)
    const found = tokenList.find((e) => e.chainId === chainId)
    if (found) {
        const tokens = found.tokens
        for (let i = 0; i < tokens.length; i++) {
            for (let j = i + 1; j < tokens.length; j++) {
                const token0 = tokens[i]
                const token1 = tokens[j]
                //logger.debug(`Add listener for token0(${token0.address}) and token1(${token1.address}) in chainId ${chainId}`)
                for (let k = 0; k < FEE_TIERS.length; k++) {
                    const feeAmount = FEE_TIERS[k].value * 10000
                    try {
                        await addWebSocketListener(token0, token1, feeAmount, publicClient)
                    } catch (error) {
                        logger.warn(error)
                    }
                }
            }
        }
        
    } else {
        logger.error(`No found token list for chainId ${chainId}. Please add it`)
    }
} 

addAllWebSocketListeners(1).catch((e) => {
    logger.error(`Failed to add websocket listeners due to ${e}`)
    process.exit(1)
})

