import jwt from "jsonwebtoken"
import getConfig from "../../config/configuration"
import { AccountInfoType } from "../../controllers/types"

const generateToken = (params: AccountInfoType) => {
    const config = getConfig()
    const jwt_secret = config.jwt_secret
    return jwt.sign({
        id: params.id,
        name: params.name,
        roles: params.roles,
        email: params.email
    }, jwt_secret, {expiresIn: '18000s'})
}

export default {
    generateToken: generateToken
}
    