import User from "../models/user.model"
import logger from "../../helpers/logger"
import { UserError } from "../../routes/user/UserErrors"
import { UserDAOParamType } from "./types"

class UserDAO {
    async create(params: UserDAOParamType) {
        try {
            const userDao = new User({
                name: params.name,
                profile: params.profile,
                address: params.address,
                intro: params.intro
            })
            const savedUser = await userDao.save()
            logger.debug('UserDAO.create. A new user is saved successfully', savedUser)
            return savedUser
        } catch (err: any) {
            logger.error('Failed to save user due to ', err)
            throw new UserError({key: 'user_register_validiation_failed', params:[params.name], errors: err.errors ? err.errors : err.message, code: 400})
        } 
    }

    async findOneAndUpdate(filter: {[P in keyof UserDAOParamType]?: UserDAOParamType[P]}, update: {[P in keyof UserDAOParamType]?: UserDAOParamType[P]}) {
        try {
            const user = await User.findOneAndUpdate(filter, update, {new: true})
            return user
        } catch (err) {
            logger.error('Failed to update due to ', err)
            throw err
        }
    }

    async findOneByFilter(filter:  {[P in keyof UserDAOParamType]?: UserDAOParamType[P]}) {
        const user = await User.findOne(filter)
        return user
    }
}

const userDao = new UserDAO()
export default userDao