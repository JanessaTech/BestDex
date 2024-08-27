import express from 'express'
import accountController from '../../controllers/AccountController'
import accountSchema from '../schemas/account'

//const accountService = require('../../services/account.service')
//const {validate, authenticate, authorize} = require('../../middlewares')
import initAccountErrorHandlers from './accountErrorHandlers'

const router = express.Router()

//router.post('/login', validate(accountSchema.login), accountController.login)
router.post('/login', accountController.login)
// router.post('/register', validate(accountSchema.register), controller.register)
// router.get('/', authenticate(accountService),authorize(), controller.getAllAccounts)
// router.get('/:id', authenticate(accountService), authorize(), validate(accountSchema.getByAccountId), controller.getAccountById)
// router.put('/', authenticate(accountService),authorize(),validate(accountSchema.updateAccount), controller.updateAccount)
// router.delete('/:id', authenticate(accountService), authorize(),validate(accountSchema.deleteAccount), controller.deleteAccountById)

initAccountErrorHandlers(router)

export default router