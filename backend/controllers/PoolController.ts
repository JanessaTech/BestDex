import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import { liveQueryClient, webSocketClient } from "../infra"
import messageHelper from "../helpers/internationalization/messageHelper"
import { sendSuccess } from "../routes/ReponseHandler"
import { PoolError } from "../routes/pool/PoolErrors"
import getConfig from "../config/configuration"


class PoolController {
    async getLatestPoolInfo(req: Request, res: Response, next: NextFunction) {
        const chainId = Number(req.params.chainId)
        const poolAddress = (req.query.poolAddress as string).toLowerCase() as `0x${string}`
        logger.debug('chainId =', chainId)
        logger.debug('poolAddress =', poolAddress)
        const config = getConfig()
        try {
            let poolInfo:any = undefined
            // if (config.env === 'local') {
            //     poolInfo = webSocketClient.getLatestPoolInfo(chainId, poolAddress)
            // } else {
            //     poolInfo = liveQueryClient.getLatestPoolInfo(chainId, poolAddress)
            // }
            if (chainId === 31337) {
                if (!webSocketClient) throw new PoolError({key: 'pool_info_getByws_failed', params: [poolAddress, chainId]})
                poolInfo = webSocketClient.getLatestPoolInfo(chainId, poolAddress)
            } else {
                if (!liveQueryClient) throw new PoolError({key: 'pool_info_getByLive_failed', params: [poolAddress, chainId]})
                poolInfo = liveQueryClient?.getLatestPoolInfo(chainId, poolAddress)
            }
            
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