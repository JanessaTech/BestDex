import { RouterType } from "../../helpers/types/Types";
import { Request, Response, NextFunction } from "express";
import { TransactionError} from "./TransactionErros";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"

const initTransactionErrorHandlers = (router: RouterType) => {
    function handleTransactionError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof TransactionError) {
                logger.debug('error handing TransactionError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleTransactionError ')
                next(error)
            }
        }
    }
    router.use(handleTransactionError())
}

export default initTransactionErrorHandlers