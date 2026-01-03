import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import { liveQueryClient, webSocketClient } from "../infra"
import messageHelper from "../helpers/internationalization/messageHelper"
import { sendSuccess } from "../routes/ReponseHandler"
import { PoolError } from "../routes/pool/PoolErrors"
import { PoolInfo } from "./types"
import getConfig from "../config/configuration"

class PoolController {
    async getLatestPoolInfo(req: Request, res: Response, next: NextFunction) {
        const chainId = Number(req.params.chainId)
        const poolAddress = req.query.poolAddress as `0x${string}`
        logger.debug('chainId =', chainId)
        logger.debug('poolAddress =', poolAddress)
        const config = getConfig()
        try {
            let result:any = undefined
            if (config.env === 'local') {
                result = webSocketClient.getLatestPoolInfo(chainId, poolAddress)
            } else {
                result = liveQueryClient.getLatestPoolInfo(chainId, poolAddress)
            }
            
            if (result) {
                const payload: PoolInfo = {
                    token0: result.token0,
                    token1: result.token1,
                    fee: result.fee,
                    tickSpacing: result.tickSpacing,
                    sqrtPriceX96: result.sqrtPriceX96,
                    tick: result.tick,
                    liquidity: result.liquidity,
                    timeStamp: result.timestamp
                }
                let message = messageHelper.getMessage('pool_info_get_success', poolAddress, chainId)
                sendSuccess(res, message, payload)
            } else {
                throw new PoolError({key: 'pool_info_get_failed', params: [poolAddress, chainId]})
            }
        } catch (error) {
            next(error)
        } 
    }
}

const controller = new PoolController()
export default controller