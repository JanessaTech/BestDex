import { sendSuccess } from "../routes/ReponseHandler"
import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import { generateNonce, SiweMessage } from 'siwe'
import { SiweError } from "../routes/siwe/SiweError"

class SiweController {
    async nonce(req: Request, res: Response, next: NextFunction) {
        logger.info('SiweController.nonce')
        try {
            const payload = {nonce: generateNonce()}
            let message = messageHelper.getMessage('siwe_none')
            sendSuccess(res, message, payload)
        }catch(e) {
            next(e)
        }
    }
    async verify(req: Request, res: Response, next: NextFunction) {
        logger.info('SiweController.verify')
        try {
            const { message, signature } = req.body
            const siweMessage = new SiweMessage(message);
            try {
                await siweMessage.verify({ signature });
                const payload = {verify: true}
                let message = messageHelper.getMessage('siwe_verify_success')
                sendSuccess(res, message, payload)
            } catch(err) {
                throw new SiweError({key: 'siwe_verify_failed', code:400})
            }
        } catch(e) {
            next(e)
        }
    }

}

const controller = new SiweController()
export default controller