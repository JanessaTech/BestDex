import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import { webSocketClient } from "../infra"
import messageHelper from "../helpers/internationalization/messageHelper"
import { sendSuccess } from "../routes/ReponseHandler"
import { PoolError } from "../routes/pool/PoolErrors"

class PoolController {
    async getLatestPoolInfo(req: Request, res: Response, next: NextFunction) {
        const chainId = Number(req.params.chainId)
        const poolAddress = req.query.poolAddress as `0x${string}`
        logger.debug('chainId =', chainId)
        logger.debug('poolAddress =', poolAddress)
        try {
            const poolInfo = webSocketClient.getLatestPoolInfo(chainId, poolAddress)
            if (poolInfo) {
                let message = messageHelper.getMessage('pool_info_get_success', poolAddress, chainId)
                sendSuccess(res, message, poolInfo)
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