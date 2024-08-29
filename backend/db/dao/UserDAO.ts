import User from "../model/user.model"
import logger from "../../helpers/logger"
import { UserError } from "../../routes/user/UserErrors"
import { UserType } from "./types/TypesInDao"

class UserDAO {
    async create(user: UserType) {
        try {
            const userDao = new User({
                name: user.name,
                profile: user.profile,
                address: user.address,
                intro: user.intro
            })
            const savedUser = await userDao.save()
            logger.debug('UserDAO.create. A new user is saved successfully', savedUser)
            return savedUser
        } catch (err: any) {
            logger.error('Failed to save user due to ', err)
            throw new UserError({key: 'user_register_validiation_failed', params:[user.name], errors: err.errors ? err.errors : err.message, code: 400})
        } 
    }

    async findOneAndUpdate(filter: {[P in keyof UserType]?: UserType[P]}, update: {[P in keyof UserType]?: UserType[P]}) {
        try {
            const user = await User.findOneAndUpdate(filter, update, {new: true})
            return user
        } catch (err) {
            logger.error('Failed to update due to ', err)
            throw err
        }
    }

    async findOneByFilter(filter:  {[P in keyof UserType]?: UserType[P]}) {
        const user = await User.findOne(filter)
        return user
    }
}

const userDao = new UserDAO()
export default userDao