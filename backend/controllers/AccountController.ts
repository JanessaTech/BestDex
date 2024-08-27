//const accountService = require('../services/account.service')
import { sendSuccess } from "../routes/ReponseHandler"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import bcrypt from 'bcrypt'
import generateToken from '../helpers/jwt/token'
import { Request, Response, NextFunction } from "express"
import { TokenGeneratedParams } from "../types/Types"

class AccountController {
    async login(req: Request, res: Response, next: NextFunction) {
        logger.info('login')
        const payload: TokenGeneratedParams = {
            id: 1,
            name: 'Jane',
            roles: ['admin'],
            email: 'jane@gmail.com'
        }
        payload.token = generateToken(payload)
        let message = messageHelper.getMessage('account_login', payload.name)
        sendSuccess(res, message, payload)
    }
}

const accountController = new AccountController()
export default accountController