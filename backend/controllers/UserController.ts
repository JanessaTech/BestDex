import logger from "../helpers/logger"
import { Request, Response, NextFunction } from "express"
import { sendSuccess } from "../routes/ReponseHandler"
import messageHelper from "../helpers/internationalization/messageHelper"
import userService from "../services/UserService"
import { UserError } from "../routes/user/UserErrors"
import type { UserRegisterInputType, UserUpdateInputType } from "./types/TypesInController"

class UserController {
    async register(req: Request, res: Response, next: NextFunction) {
        logger.info('UserController.register')
        try {
            const user: UserRegisterInputType = {
                name: req.body.name,
                profile: req?.file?.filename,
                address: req.body.address,
                intro: req.body.intro
            }
            const payload = await userService.register(user)
            sendSuccess(res, messageHelper.getMessage('user_register', payload.name), {user: payload})
        } catch (e) {
            next(e)
        }
    }


    /**
     * Login by wallet address, returns the user info
     * @param {
     *          body: {
     *              address - The wallet address used to login. If the user associated with the address doesn't exist, 404 is returned
     *          }
     *        } req    : The request sent by frontend
     * @param {*} res  : The response sent back to frontend. The format is the same as register
     * @param {*} next : The object used by routes to control the workflow of req&res&exception handling
     */
    async loginByAddress(req: Request, res: Response, next: NextFunction) {
        logger.info('UserController.login. address=', req.body.address)
        try {
            const address = req.body.address
            const payload = await userService.loginByAddress(address)
            sendSuccess(res, messageHelper.getMessage('user_login_success', address), {user: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Logout for an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async logoutByAddress(req: Request, res: Response, next: NextFunction) {
        logger.info('UserController.logout address=', req.body.address)
        try {
            const address = req.body.address
            const payload = await userService.logoutByAddress(address)
            sendSuccess(res, messageHelper.getMessage('user_logout_success', address), {user: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Update user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req: Request, res: Response, next: NextFunction) {
        logger.info('UserController.update. id =',req.body.id, 'name = ', req.body.name, ' intro =', req.body.intro, ' profile =', req?.file?.filename)
        const toUpdate: UserUpdateInputType = {
            id : Number(req.body.id), 
            name: req.body.name,
            intro: req.body.intro,
            profile: req?.file?.filename
        }
        try {
            const payload = await userService.update(toUpdate)
            sendSuccess(res, messageHelper.getMessage('user_update_success', toUpdate.id, toUpdate.name, toUpdate.intro, toUpdate.profile), {user: payload})
        } catch (e) {
            next(e)
        }

    }

    /**
     * Get an overview of a user by id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getOverViewById(req: Request, res: Response, next: NextFunction) {
        logger.info('UserController.getOverViewById. id =', req.params.id)
        const id = Number(req.params.id)
        try {
            const user = await userService.findUserById(id)
            sendSuccess(res, messageHelper.getMessage('user_overview_success', id), {overview: user})
        } catch (e) {
            if (!(e instanceof UserError)) {
                throw new UserError({key: 'user_overview_failed', params: [id, e]})
            } else {
                next(e)
            }
        }
    }

    /**
    * Get the user which is associated with a wallet address
    * @param {
    *          params:{
    *              address - The wallet address used to get user
    *          } 
    *        } req    : The request sent by frontend
    * @param {*} res  : The response sent back to frontend. The format is the same as register
    * @param {*} next : The object used by routes to control the workflow of req&res&exception handling
    */
    async findUserByAddress(req: Request, res: Response, next: NextFunction) {
        logger.info('UserController.findUserByAddress. address = ', req.params?.address)
        try {
            const address = req.params.address
            const payload = await userService.findUserByAddress(address)
            sendSuccess(res, messageHelper.getMessage('user_find_by_address', address), {user: payload})
        } catch(e) {
            next(e)
        }
    }
}

const userController = new UserController()
export default userController