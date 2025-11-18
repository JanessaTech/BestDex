import express from 'express'
import initTransactionErrorHandlers from './InitTransactionErrorHandlers'
import controller from '../../controllers/TransactionController'
import transactionSchema from '../schemas/transaction'
import {validate} from '../../middlewares'

const router = express.Router()
router.post('/', validate(transactionSchema.create), controller.create)
router.get('/:chainId', validate(transactionSchema.getTransactions), controller.getTransactions)

initTransactionErrorHandlers(router)

export default router