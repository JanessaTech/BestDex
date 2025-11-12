import express from 'express'
import initPositionErrorHandlers from './InitPositionErrorHandlers'
import controller from '../../controllers/PositionController'
import positionSchema from '../schemas/position'
import {validate} from '../../middlewares'


const router = express.Router()
router.get('/:chainId', validate(positionSchema.getPositions), controller.getPositions)


initPositionErrorHandlers(router)

export default router