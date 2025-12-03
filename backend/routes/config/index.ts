import express from 'express'
import controller from '../../controllers/ConfigurationController'
import initConfigErrorHandlers from './InitConfigErrorHandlers'

const router = express.Router()
router.get('/tokenList', controller.getTokenList)
router.get('/feetiers', controller.getFeeTiers)

initConfigErrorHandlers(router)

export default router
