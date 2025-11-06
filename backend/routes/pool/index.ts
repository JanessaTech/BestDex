import express from 'express'
import controller from '../../controllers/PoolController'
import initPoolErrorHandlers from './InitPoolErrorHandlers'
import {validate} from '../../middlewares'
import poolSchema from '../schemas/pool'

const router = express.Router()
router.get('/getLatestPoolInfo/:chainId',validate(poolSchema.getLatestPoolInfo), controller.getLatestPoolInfo)

initPoolErrorHandlers(router)

export default router