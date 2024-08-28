declare const ENV_OPTIONS: readonly['local', 'testnet', 'mainnet']
type Env_Align = (typeof ENV_OPTIONS)[number]
type ConfigType = {
    env: Env_Align
    port: number
    apiPrefix: string
    jwt_secret: string
    staticDirs: {
        profiles: string
    }
    multer: {
        profileSize: number,
        fileTypes: RegExp
        acceptedImageTypes: string[]
        profileFieldPrefix: string
    }
}

export default ConfigType