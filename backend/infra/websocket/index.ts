import { calcPoolAddress } from "../utils/Pool"
import logger from '../../helpers/logger'
import { PoolMetaData, TokenType } from "../types/TypesInInfra"
import UniswapV3PoolListener from "./UniswapV3PoolListener"
import LocalUniswapV3PoolListener from "./LocalUniswapV3PoolListener"
import { FEE_TIERS, chainUrls, tokenList } from "../../config/data/hardcode"
import { PublicClient } from 'viem'
import { createBlockchainClient } from "../utils/Chain"

export const websocketsMap: Map<number, Map<`0x${string}`, PoolMetaData>> = new Map([])

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
    if (!websocketsMap.get(chainId)?.get(poolAddress)) { // add listener only when no listener
        let listener!: UniswapV3PoolListener | LocalUniswapV3PoolListener
        if (chainId === 31337) { //for test
            listener = new LocalUniswapV3PoolListener(poolAddress, wssURL, publicClient)
        } else {
            listener = new UniswapV3PoolListener(poolAddress, wssURL, publicClient)
        }
        if (!websocketsMap.has(chainId)) {
            websocketsMap.set(chainId, new Map())
        }
        const metaData = {listener: listener, token0: token0, token1: token1, feeAmount: feeAmount}
        websocketsMap.get(chainId)?.set(poolAddress, metaData)
        logger.info('A new listener is added!')
    } else {
        logger.info('A new listener was already added!')
    }
}


const addAllWebSocketListeners = async (chainId: number) => {
    logger.info('Add all websocket listeners for chainId: ', chainId)
    const publicClient = createBlockchainClient(chainId)
    let addedListeners = 0
    const found = tokenList.find((e) => e.chainId === chainId)
    if (found) {
        const tokens = found.tokens
        for (let i = 0; i < tokens.length; i++) {
            for (let j = i + 1; j < tokens.length; j++) {
                const token0 = tokens[i]
                const token1 = tokens[j]
                for (let k = 0; k < FEE_TIERS.length; k++) {
                    const feeAmount = FEE_TIERS[k].value * 10000
                    try {
                        await addWebSocketListener(token0, token1, feeAmount, publicClient)
                        addedListeners++
                    } catch (error) {
                        logger.error(error)
                    }
                }
            }
        }

        logger.debug(`${addedListeners} listeners are added for chainId ${chainId}`)
    } else {
        logger.warn(`No found token list for chainId ${chainId}. Please add it`)
    }
} 

addAllWebSocketListeners(1).catch((e) => {
    logger.error(`Failed to add websocket listeners due to ${e}`)
    process.exit(1)
})

