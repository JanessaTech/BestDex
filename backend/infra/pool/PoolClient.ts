import EventEmitter from "events";
import { FEE_TIERS, tokenList } from "../../config/data/hardcode";
import logger from "../../helpers/logger";
import { createBlockchainClient } from "../utils/Chain";
import { calcPoolAddress } from "../utils/Pool";

interface PoolClientEvents {
    'ready': () => void
}
export interface PoolClient {
    on<K extends keyof PoolClientEvents>(msg:K, listener: PoolClientEvents[K]):this;
    emit<K extends keyof PoolClientEvents>(msg:K, ...args: Parameters<PoolClientEvents[K]>): boolean
}

export class PoolClient extends EventEmitter {
    public poolAddressMap: Map<number, Map<`0x${string}`, {token0: `0x${string}`, token1: `0x${string}`, fee: number}>>

    constructor() {
        super()
        logger.debug('constructing Pool client...')
        this.poolAddressMap = new Map()
        
    }

    public init() {
        setTimeout(this.calculatePoolAddress, 0);
    }

    private calculatePoolAddress = async () => {
        for (let chain of tokenList) {
            const chainId = chain.chainId
            if (chainId === 31337) continue
            this.poolAddressMap.set(chainId,new Map())
            const tokens = chain.tokens
            const publicClient = createBlockchainClient(chainId)
            for (let i = 0; i < tokens.length; i++) {
                for (let j = i + 1; j < tokens.length; j++) {
                    const token0 = tokens[i]
                    const token1 = tokens[j]
                    for (let k = 0; k < FEE_TIERS.length; k++) {
                        const feeAmount = FEE_TIERS[k].value * 10000
                        try {
                            const poolAddress = await calcPoolAddress(token0.address, token1.address, feeAmount, chainId, publicClient)
                            const t0LowerCase = token0.address.toLowerCase() as `0x${string}`
                            const t1LowerCase = token1.address.toLowerCase() as `0x${string}`
                            const [t0, t1] = t0LowerCase < t1LowerCase 
                            ? [t0LowerCase , t1LowerCase]
                            : [t1LowerCase, t0LowerCase]
                            this.poolAddressMap.get(chainId)?.set(poolAddress.toLowerCase() as `0x${string}`, {token0: t0, token1: t1, fee: feeAmount})
                            //logger.debug(`poolAddress=${poolAddress}, token0=${token0.symbol}, token1=${token1.symbol}, chainId=${chainId} ,feeAmount=${feeAmount}`)
                        } catch(error) {
                            logger.error('poolAddress is invalid due to:', error)
                        } 
                    }
                }
            }
        } 

        logger.info('Send emit: ready')
        this.emit('ready')
    }
}