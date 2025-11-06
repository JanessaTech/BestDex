import { RouterType } from "../../helpers/types/Types";
import { Request, Response, NextFunction } from "express";
import { PoolError } from "./PoolErrors";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"

const initPoolErrorHandlers = (router: RouterType) => {
    function handlePoolError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof PoolError) {
                logger.debug('error handing PoolError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handlePoolError ')
                next(error)
            }
        }
    }
    router.use(handlePoolError())
}

export default initPoolErrorHandlers