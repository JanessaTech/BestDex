import express from 'express'
import controller from '../../controllers/AccountController'
import accountSchema from '../schemas/account'
import {validate, authenticate, authorize} from '../../middlewares'
import accountService from '../../services/AccountService'
import initAccountErrorHandlers from './InitAccountErrorHandlers'

const router = express.Router()

router.post('/login', validate(accountSchema.login), controller.login)
router.post('/register', validate(accountSchema.register), controller.register)
router.get('/', authenticate(accountService), authorize(), controller.getAllAccounts)
router.get('/:id', authenticate(accountService), authorize(), validate(accountSchema.getByAccountId), controller.getAccountById)
router.put('/', authenticate(accountService),authorize(),validate(accountSchema.updateAccount), controller.updateAccount)
router.delete('/:id', authenticate(accountService), authorize(),validate(accountSchema.deleteAccount), controller.deleteAccountById)

initAccountErrorHandlers(router)

export default router