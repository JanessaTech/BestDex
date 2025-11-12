import { sendSuccess } from "../routes/ReponseHandler"
import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import positionService from "../services/PositionService"

class PositionController {
    async getPositions(req: Request, res: Response, next: NextFunction)  {
        const chainId = Number(req.params.chainId)
        const owner = req.query.owner as `0x${string}`
        logger.debug('chainId =', chainId)
        logger.debug('owner =', owner)
        try {
            const payload = await positionService.getPositions(chainId, owner)
            let message = messageHelper.getMessage('positions_get_success', owner, chainId)
            sendSuccess(res, message, payload)
        } catch (error) {
            next(error)
        }
    }
}

const controller = new PositionController()
export default controller