import jwt from "jsonwebtoken"
import getConfig from "../../config/configuration"
import { TokenGeneratedParams } from "../../types/Types"

const generateToken = (params: TokenGeneratedParams) => {
    const platform = process.env.PLATFORM || 'mainnet'
    const config = getConfig(platform as 'local' | 'testnet' | 'mainnet')
    const jwt_secret = config.jwt_secret
    return jwt.sign({
        id: params.id,
        name: params.name,
        roles: params.roles,
        email: params.email
    }, jwt_secret, {expiresIn: '18000s'})
}

export default generateToken