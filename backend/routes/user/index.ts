import express from 'express'
import controller from '../../controllers/UserController'
import userSchema from '../schemas/user'
import {validate, upload} from '../../middlewares'
import getConfig from '../../config/configuration'
import initUserErrorHandlers from './InitUserErrorHandlers'

const config = getConfig()
const router = express.Router()

router.post('/register',  upload(config.multer.profileFieldPrefix), validate(userSchema.register), controller.register)
router.get('/:address', validate(userSchema.findUserByAddress), controller.findUserByAddress)
router.post('/login', validate(userSchema.loginByAddress), controller.loginByAddress)
router.post('/logout', validate(userSchema.logoutByAddress), controller.logoutByAddress)
router.post('/update', upload(config.multer.profileFieldPrefix), validate(userSchema.update), controller.update)
router.get('/overview/:id', validate(userSchema.getOverViewById), controller.getOverViewById)

initUserErrorHandlers(router)
export default router