import {AccountError} from './AccountErrors'
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"
import { Request, Response, NextFunction } from "express";
import { RouterType } from '../../helpers/types/Types';

const initAccountErrorHandlers = (router: RouterType) => {
    function handleAccountError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof AccountError) {
                logger.debug('error handing AccountError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleAccountError ')
                next(error)
            }
        }
    }
    router.use(handleAccountError())
}

export default initAccountErrorHandlers