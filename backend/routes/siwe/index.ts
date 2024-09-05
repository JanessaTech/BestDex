import express from 'express'
import controller from '../../controllers/SiweController'
import initSiweErrorHandlers from './InitSiweErrorHandlers'

const router = express.Router()

router.get('/nonce', controller.nonce)
router.post('/verify', controller.verify)

initSiweErrorHandlers(router)
export default router