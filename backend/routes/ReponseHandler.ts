import messageHelper from "../helpers/internationalization/messageHelper"
import { Response } from "express"

export const sendSuccess = (res: Response, message: string,  data: any = undefined, code: number = 200) => {
    res.status(code).json({
        success: true,
        code: code,
        message: message,
        data : data
    })
}

export const sendError = (res: Response, error: any, errorCode: number = 400, errorKey: string = 'Error') => {
    let key = error?.key || errorKey || error?.name
    let code = error?.code && typeof error?.code === 'number' ? error.code : errorCode
    let params = error?.params || []
    let message = error?.message || messageHelper.getMessage(key, ...params)
    res.status(code).json({
        success: false,
        code: code,
        message: message,
        errors: error.errors
    })
}