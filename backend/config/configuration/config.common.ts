import type ConfigType from "./config.types"

const commonConfig: ConfigType = {
    // basic config
    env: 'mainnet',
    port: 3100,
    apiPrefix: '/apis/v1',
    jwt_secret: 'This_is_very_secret_string',
    staticDirs: {
        profiles : 'uploads'
    },
    multer: {
        profileSize: 1048576, // less than 1M,
        fileTypes: /jpeg|jpg|png|gif/,  // file types accepted
        acceptedImageTypes: ['image/gif', 'image/jpeg', 'image/png'],
        profileFieldPrefix:'profile',
    }
}

export default commonConfig