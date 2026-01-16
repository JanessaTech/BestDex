import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import { sendSuccess } from "../routes/ReponseHandler"
import messageHelper from "../helpers/internationalization/messageHelper"
import { liveQueryClient} from "../infra"
import { SubgraphError } from "../routes/subgraph/SubgraphErrors"

class GraphLiveController {
    async getStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const chainName = req.params.chainName
            if (!liveQueryClient) throw new SubgraphError({key: 'subgraph_monitor_live_client_not_found'})
            const payload = liveQueryClient.getStatus(chainName)
            if (!payload) throw new SubgraphError({key: 'subgraph_monitor_live_status_missing', params: [chainName]})
            const message = messageHelper.getMessage('subgraph_monitor_live_status_get_success', chainName)
            sendSuccess(res, message, payload)    
        } catch(error) {
            next(error)
        } 
    }

    async getStatuses(req: Request, res: Response, next: NextFunction) {
        try {
            if (!liveQueryClient) throw new SubgraphError({key: 'subgraph_monitor_live_client_not_found'})
            const payload = liveQueryClient.getAllStatuses()
            const message = messageHelper.getMessage('subgraph_monitor_live_statuses_get_success')
            sendSuccess(res, message, payload)
        } catch(error) {
            next(error)
        }
    }
}

const controller = new GraphLiveController()
export default controller