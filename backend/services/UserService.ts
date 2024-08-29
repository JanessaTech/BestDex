import logger from "../helpers/logger";
import { UserService } from "./types/TypesInService";
import { UserError } from "../routes/user/UserErrors";
import messageHelper from "../helpers/internationalization/messageHelper";
import type { UserRegisterInputType, UserUpdateInputType } from "../controllers/types/TypesInController";
import userDao from "../db/dao/UserDAO";

class UserServiceImp implements UserService {
    async register(user: UserRegisterInputType) {
        logger.info('UserService.register...')
        try {
            const byName = await userDao.findOneByFilter({name: user.name})
            if (byName) {
                throw new UserError({key: 'user_register_duplication_name', params:[user.name], code: 400})
            }
            const byAddress = await userDao.findOneByFilter({address: user.address})
            if (byAddress) {
                throw new UserError({key: 'user_register_duplication_address', params:[user.address], code: 400})
            }
            return await userDao.create(user)
        } catch(e) {
            logger.error('Failed to register the user', user)
            throw e
        }
    }

    async loginByAddress(address: string) {
        logger.info('UserService.login')
        try {
            const user = await userDao.findOneAndUpdate({address: address}, {loginTime: new Date()})
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch(e) {
            logger.error('Failed to login by address =', address)
            throw e
        }
    }

    async logoutByAddress(address: string) {
        try {
            const user = await userDao.findOneAndUpdate({address: address}, {logoutTime: new Date()})
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch(e) {
            logger.error('Failed to logout by address =', address)
            throw e
        }
    }

    async update(toUpdate: UserUpdateInputType) {
        logger.info('UserService.update')
        try {
            const filter = {_id: toUpdate.id}
            const update: UserUpdateInputType = {}
            if (toUpdate.name) {
                update.name = toUpdate.name
            }
            if (toUpdate.intro) {
                update.intro = toUpdate.intro
            }
            if (toUpdate.profile) {
                update.profile = toUpdate.profile
            }
            const user = await userDao.findOneAndUpdate(filter, update)
            if (!user) {
                throw new UserError({key: 'user_not_found_id', params:[toUpdate.id], code: 404})
            }
            return user
        } catch(e) {
            const errMsg  = messageHelper.getMessage('user_update_failed', toUpdate.id, toUpdate.name, toUpdate.intro, e)
            logger.error(errMsg)
            throw new UserError({message: errMsg})
        }
    }

    async findUserByAddress(address: string) {
        logger.info('UserService.findUserByAddress')
        try {
            const user = await userDao.findOneByFilter({address: address})
            if (!user) {
                throw new UserError({key: 'user_not_found_address', params:[address], code: 404})
            }
            return user
        } catch (e) {
            logger.error('Failed to find user by address ', address)
            throw e
        }
    }

    async findUserById(id: number) {
        logger.info('UserService.findUserById. id=', id)
        try {
            const user = await userDao.findOneByFilter({_id: id})
            if (!user) {
                throw new UserError({key: 'user_not_found_id', params:[id], code: 404})
            }
            return user
        } catch (e) {
            logger.error('Failed to find user by id ', id)
            throw e
        }
    }
}

const userService = new UserServiceImp()
export default userService