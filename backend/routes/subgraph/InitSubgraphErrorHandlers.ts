import { RouterType } from "../../helpers/types/Types";
import { Request, Response, NextFunction } from "express";
import { SubgraphError } from "./SubgraphErrors";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"

const initSubgraphErrorHandlers = (router: RouterType) => {
    function handleSubgraphError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof SubgraphError) {
                logger.debug('error handing SubgraphError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleSubgraphError ')
                next(error)
            }
        }
    }
    router.use(handleSubgraphError())
}

export default initSubgraphErrorHandlers