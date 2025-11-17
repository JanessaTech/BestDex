import express from 'express'
import initTransactionErrorHandlers from './InitTransactionErrorHandlers'
import controller from '../../controllers/TransactionController'

const router = express.Router()
router.get('/', controller.getTransactions)
router.post('/', controller.createTransaction)

initTransactionErrorHandlers(router)

export default router