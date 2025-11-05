import { calcPoolAddress } from "../utils/Pool"
import logger from '../../helpers/logger'
import { TokenType } from "../types/TypesInInfra"
import UniswapV3PoolListener from "./UniswapV3PoolListener"
import LocalUniswapV3PoolListener from "./LocalUniswapV3PoolListener"
import { chainUrls, tokenList } from "../../config/data/hardcode"
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
        console.log('poolAddress is invalid due to:', error)
        throw new Error('Invalid pool address')
    }
    let found = chainUrls.get(chainId)
    if (!found) {
        logger.error(`No found wss url for ${chainId}`)
        throw new Error(`No found wss url for ${chainId}`)
    }
    const wssURL = found[2]

    logger.debug(`poolAddress =${poolAddress}, wssURL=${wssURL}`)
    if (!publicClient) throw new Error('publicClient is null')
    if (!listenersMap.get(chainId)?.get(poolAddress)) { // add listener only when no listener
        let listener!: UniswapV3PoolListener | LocalUniswapV3PoolListener
        if (chainId === 31337) { //for test
            listener = new LocalUniswapV3PoolListener(poolAddress, wssURL, publicClient)
        } else {
            listener = new UniswapV3PoolListener(poolAddress, wssURL, publicClient)
        }
        const newListenersMap = new Map(listenersMap)
        if (!listenersMap.has(chainId)) {
            listenersMap.set(chainId, new Map())
        }
        listenersMap.get(chainId)?.set(poolAddress, listener)
        logger.info('A new listener is added!')
    } else {
        logger.info('A new listener was already added!')
    }
}


const addAllWebSocketListeners = (chainId: number) => {
    logger.info('Add all websocket listeners for chainId: ', chainId)
    const publicClient = createBlockchainClient(chainId)
    const found = tokenList.find((e) => e.chainId === chainId)
    if (found) {
        const tokens = found.tokens
        logger.info(JSON.stringify(tokens, null, 2))
    } else {
        logger.error(`No found token list for chainId ${chainId}. Please add it`)
        process.exit(1)
    }
} 

addAllWebSocketListeners(1)

