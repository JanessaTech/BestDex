import { sendSuccess } from "../routes/ReponseHandler"
import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import { tokenList } from "../config/data/hardcode"

class ConfigurationController {
    async getTokenList(req: Request, res: Response, next: NextFunction) {
        try {
            logger.debug('get the token list configured in ConfigurationController.getTokenList')
            const payload = tokenList
            let message = messageHelper.getMessage('config_tokens_getList_success')
            sendSuccess(res, message, payload)
        } catch(error) {
            next(error)
        }
    }
}

const configurationController = new ConfigurationController()
export default configurationController
