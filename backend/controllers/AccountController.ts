import { sendSuccess } from "../routes/ReponseHandler"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import bcrypt from 'bcrypt'
import tokenHelper from '../helpers/jwt/token'
import { Request, Response, NextFunction } from "express"
import type { LoginInPutType, AccountInfoType } from "./types/TypesInController"
import accountService from "../services/AccountService"

class AccountController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('login')
            const acc: LoginInPutType = {
                name : req.body.name,
                password: req.body.password
            }
            let payload = await accountService.login(acc)
            payload.token = tokenHelper.generateToken(payload)
            let message = messageHelper.getMessage('account_login', payload.name)
            sendSuccess(res, message, payload)
        } catch (e) {
            next(e)
        }
    }

    async register(req: Request, res: Response, next: NextFunction){
        logger.info('AccountController.register')
        try {
            const acc: AccountInfoType = {
                name: req.body.name,
                password : bcrypt.hashSync(req.body.password,8),
                roles: req.body.roles,
                email: req.body.email
            }
            let payload = await accountService.register(acc)
            sendSuccess(res, messageHelper.getMessage('account_register', payload.name))
        } catch (e) {
            next(e)
        }
    }

    async getAllAccounts(req: Request, res: Response, next: NextFunction) {
        logger.info('AccountController.getAllAccounts')
        try {
            let payload = await accountService.getAllAccounts()
            sendSuccess(res, messageHelper.getMessage('account_getAll'), payload)
        } catch (e) {
            next(e)
        }
    }

    async getAccountById(req: Request, res: Response, next: NextFunction) {
        logger.info('AccountController.getAccountById')
        try {
            let payload = await accountService.getAccountById(req.params.id)
            sendSuccess(res, messageHelper.getMessage('account_getById', req.params.id), payload)
        }catch (e) {
            next(e)
        }
    }

    async updateAccount(req: Request, res: Response, next: NextFunction){
        logger.info('AccountController.updateUser')
        try {
            let payload = await accountService.updateAccount(req.body)
            sendSuccess(res, messageHelper.getMessage('account_update', payload.name), payload)
        } catch (e) {
            next(e)
        }
    }

    async deleteAccountById(req: Request, res: Response, next: NextFunction){
        logger.info('AccountController.deleteUserById')
        try{
            await accountService.deleteAccountById(req.params.id)
            sendSuccess(res, messageHelper.getMessage('account_deleteById', req.params.id))
        } catch (e) {
            next(e)
        }
    }
}

const accountController = new AccountController()
export default accountController