import express from 'express'
import initTokenPriceErrorHandlers from './InitTokenPriceErrorHandlers'
import controller from '../../controllers/TokenPriceController'

const router = express.Router()
router.get('/getTokenPrices', controller.getLatestPrices)

initTokenPriceErrorHandlers(router)

export default router