import { RouterType } from "../../helpers/types/Types";
import { Request, Response, NextFunction } from "express";
import { TokenPriceError } from "./TokenPriceErrors";
import logger from "../../helpers/logger"
import { sendError } from "../ReponseHandler"

const initTokenPriceErrorHandlers = (router: RouterType) => {
    function handleTokenPriceError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof TokenPriceError) {
                logger.debug('error handing TokenPriceError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleTokenPriceError ')
                next(error)
            }
        }
    }
    router.use(handleTokenPriceError())
}

export default initTokenPriceErrorHandlers