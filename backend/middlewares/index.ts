import logger from "../helpers/logger"
import jwt from "jsonwebtoken"
import {UnSupportedAuthError, UnauthorizedError, UnmatchedTokenError} from "../routes/base_errors/GlobalErrors"
import { Request, Response, NextFunction } from "express"
import multer, {FileFilterCallback} from "multer"
import getConfig from "../config/configuration"
import path from "path"
import httpHelper from '../helpers/httpHelper'
import yup from 'yup'
import { AccountService } from "../services/types/TypesInService"


const config = getConfig()
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${config.staticDirs.profiles}/${config.env}`)
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0]
        cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`)
    }
})
const uploadProfile = multer({
    storage: profileStorage,
    limits: { fileSize: config.multer.profileSize}, // less than 1M
    fileFilter: (req, file, cb) => {
        checkFileType(req, file, cb);
    },
});

function checkFileType(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    // Allowed extensions
    var fileTypes = config.multer.fileTypes
    var acceptedImageTypes = config.multer.acceptedImageTypes
    // Check extention
    var extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    var accepted = acceptedImageTypes.includes(file.mimetype);
    if (accepted && extname) {
        return cb(null, true);
    }
    cb(null, false);
  }

export const validate =  (schema: yup.AnySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.validateSync({body: req.body, params: req.params, query: req.query}, {abortEarly:false, stripUnknown:true})
            next()
        } catch (e){
            next(e)
        }
    }
}

export const authenticate  = (service: AccountService) => {
    return (req: Request, res: Response, next: NextFunction) => {
        logger.debug('authentication...')
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {// Bearer
            let token = req.headers.authorization.split(' ')[1]

            jwt.verify(token, config.jwt_secret, function (err, decode: any) {
                if (err) {
                    next(err)
                } else {

                    let user = {
                        id : decode.id,
                        name : decode.name,
                        roles : decode.roles,
                        email: decode.email
                    }
                    res.locals.user = user
                    try {
                        let u = service.getAccountByIdInSyn(user.id)
                        if (u?.token !== token) {
                            const error = new UnmatchedTokenError({params: [user.name], code:400})
                            next(error)
                        } else {
                            res.locals.authenticated = true
                            next()
                        }
                    } catch (error) {
                        next(error)
                    }
                }
            })
        } else {
            const error = new UnSupportedAuthError({code:401})
            next(error)
        }
    }
}

export const authorize = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        logger.debug('authorization...')
        logger.debug('res.locals.authenticated : ' + res.locals.authenticated)
        logger.debug('req.originalUrl:' + req.originalUrl)
        logger.debug('res.locals.user:' + res.locals.user)
        let user = res.locals.user
        let authenticated = res.locals.authenticated
        let allowedPermissions = httpHelper.getRoles(req.originalUrl)
        let isAllowed = user.roles.some((r: string)=> allowedPermissions.includes(r))
        if (authenticated && isAllowed) {
            next()
        } else {
            let error = new UnauthorizedError({params: [req.originalUrl], code:401})
            next(error)
        }
    }
}

export const upload = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        logger.debug('start to upload profile file for fieldName = ', fieldName)
        uploadProfile.single(fieldName)(req, res, function(err) {
            if (err) {
                logger.debug('err:', err)
                next(err)
            } else{
                next()
            }
        })
    }
}