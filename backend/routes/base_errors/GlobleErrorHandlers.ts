import {UnSupportedAuthError, UnauthorizedError, UnmatchedTokenError, GlobalDemoError} from "./GlobalErrors"
import {sendError} from "../ReponseHandler"
import type { AppType } from "../../helpers/types/Types"
import {ValidationError} from 'yup'
import {JsonWebTokenError,TokenExpiredError} from "jsonwebtoken"
import {MulterError} from "multer"
import { Response, Request, NextFunction } from "express"

const initGlobalErrorHandlers = (app: AppType) => {
    function handleValidationError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof ValidationError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleJsonWebTokenError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof JsonWebTokenError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleTokenExpiredError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof TokenExpiredError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }
    function handleUnSupportedAuth() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof UnSupportedAuthError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleUnauthorizedError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof UnauthorizedError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleUnmatchedTokenError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof UnmatchedTokenError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleMuterError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof MulterError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    /**
     * This is an example how to handle GlobalDemoError
     * @returns
     */
    function handleGlobalDemoError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof GlobalDemoError) {
                sendError(res, error)
            } else {
                return next(error)
            }
        }
    }

    function handleDefaultError() {
        return (error: Error, req: Request, res: Response, next: NextFunction) => {
            sendError(res, error, 500)
        }
    }

    app.use(handleValidationError())
    app.use(handleJsonWebTokenError())
    app.use(handleTokenExpiredError())
    app.use(handleUnSupportedAuth())
    app.use(handleUnauthorizedError())
    app.use(handleUnmatchedTokenError())
    app.use(handleMuterError())
    app.use(handleGlobalDemoError())
    app.use(handleDefaultError())
}

export default initGlobalErrorHandlers