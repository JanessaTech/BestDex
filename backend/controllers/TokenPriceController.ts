
import { sendSuccess } from "../routes/ReponseHandler"
import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"

class TokenPriceController {
    async getLatestPrices(req: Request, res: Response, next: NextFunction) {
        const payload = {111: 1235}
        const message = 'ok price'
        sendSuccess(res, message, payload)
    }
}

const controller = new TokenPriceController()
export default controller