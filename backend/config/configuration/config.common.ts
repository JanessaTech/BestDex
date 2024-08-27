import type ConfigType from "./config.types"

const commonConfig: ConfigType = {
    // basic config
    env: 'mainnet',
    port: 3100,
    apiPrefix: '/apis/v1',
    jwt_secret: 'This_is_very_secret_string'
}

export default commonConfig