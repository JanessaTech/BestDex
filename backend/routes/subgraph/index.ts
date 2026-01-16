import express from 'express'
import controller from '../../controllers/GraphLiveController'
import InitSubgraphErrorHandlers from './InitSubgraphErrorHandlers'
import {validate} from '../../middlewares'
import subgraphSchema from '../schemas/subgraph'

const router = express.Router()
router.get('/monitor/status/:chainName',validate(subgraphSchema.getStatus), controller.getStatus)
router.get('/monitor/statuses', controller.getStatuses)

InitSubgraphErrorHandlers(router)

export default router