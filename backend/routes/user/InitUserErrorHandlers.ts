import { UserError } from "./UserErrors";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"
import { Request, Response, NextFunction } from "express";
import { RouterType } from '../../helpers/types/Types';

const initUserErrorHandlers = (router: RouterType) => {
    function handleUserError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof UserError) {
                logger.debug('error handing UserError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleAccountError ')
                next(error)
            }
        }
    }
    router.use(handleUserError())
}

export default initUserErrorHandlers