import type ConfigType from "./config.types"

const defautConfig: ConfigType = {
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
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        dataBaseName: 'mainnet',
        minPoolSize: 2, // Maintain up to x socket connections
        maxPoolSize: 5, // Maintain up to x socket connections
        connectTimeoutMS: 2000, // Give up initial connection after 2 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    }
}

export default defautConfig