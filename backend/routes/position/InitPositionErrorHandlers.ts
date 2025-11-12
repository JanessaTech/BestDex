import { RouterType } from "../../helpers/types/Types";
import { Request, Response, NextFunction } from "express";
import { PositionError} from "./PositionErrors";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"

const initPositionErrorHandlers = (router: RouterType) => {
    function handlePositionError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof PositionError) {
                logger.debug('error handing PositionError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handlePositionError ')
                next(error)
            }
        }
    }
    router.use(handlePositionError())
}

export default initPositionErrorHandlers