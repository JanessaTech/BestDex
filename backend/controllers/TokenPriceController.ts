
import { sendSuccess } from "../routes/ReponseHandler"
import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import tokenPriceService from "../services/TokenPriceService"

class TokenPriceController {
    async getLatestPrices(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('get latest token price')
            const payload = await tokenPriceService.getLatestPrices()
            let message = messageHelper.getMessage('token_price_success')
            sendSuccess(res, message, payload)
        } catch (error) {
            next(error)
        }
    }
}

const controller = new TokenPriceController()
export default controller