import { SiweError } from "./SiweError";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"
import { Request, Response, NextFunction } from "express";
import { RouterType } from '../../helpers/types/Types';

const initSiweErrorHandlers = (router: RouterType) => {
    function handleSiweError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof SiweError) {
                logger.debug('error handing SiweError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleSiweError ')
                next(error)
            }
        }
    }
    router.use(handleSiweError())
}

export default initSiweErrorHandlers