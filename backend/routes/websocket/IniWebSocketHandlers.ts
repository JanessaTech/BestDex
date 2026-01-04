import logger from "../../helpers/logger"
import { RouterType } from "../../helpers/types/Types"
import { Request, Response, NextFunction } from "express";
import { sendError } from "../ReponseHandler";
import { WebSocketError } from "./WebSocketErrors";

const initWebSocketErrorHandlers = (router: RouterType) => {
    function handleWebSocketError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof WebSocketError) {
                logger.debug('error handing WebSocketError')
                sendError(res, error)
            } else {
                logger.debug('forward error handling from handleWebSocketError ')
                next(error)
            }
        }
    }
    router.use(handleWebSocketError())
}

export default initWebSocketErrorHandlers