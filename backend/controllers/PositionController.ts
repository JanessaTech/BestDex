import { sendSuccess } from "../routes/ReponseHandler"
import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import positionService from "../services/PositionService"

class PositionController {
    async getPositions(req: Request, res: Response, next: NextFunction)  {
        const chainId = Number(req.params.chainId)
        const owner = req.query.owner?.toString().toLowerCase() as `0x${string}`
        const page = Number(req.query.page ? req.query.page : 1)
        const pageSize = Number(req.query.pageSize)
        logger.debug('chainId =', chainId)
        logger.debug('owner =', owner)
        logger.debug('page =', page)
        logger.debug('pageSize =', pageSize)
        try {
            const payload = await positionService.getPositions(chainId, owner, page, pageSize)
            let message = messageHelper.getMessage('positions_get_success', owner, chainId)
            sendSuccess(res, message, payload)
        } catch (error) {
            next(error)
        }
    }
}

const controller = new PositionController()
export default controller