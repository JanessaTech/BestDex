import { RouterType } from "../../helpers/types/Types";
import { Request, Response, NextFunction } from "express";
import { ConfigError } from "./ConfigErrors";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"

const initConfigErrorHandlers = (router: RouterType) => {
    function handleConfigError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof ConfigError) {
                logger.debug('error handing ConfigError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleConfigError ')
                next(error)
            }
        }
    }
    router.use(handleConfigError())
}

export default initConfigErrorHandlers