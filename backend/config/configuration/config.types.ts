declare const ENV_OPTIONS: readonly['local', 'testnet', 'mainnet']
type Env_Align = (typeof ENV_OPTIONS)[number]
type ConfigType = {
    env: Env_Align
    port: number
    apiPrefix: string
}

export default ConfigType