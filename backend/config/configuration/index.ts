import localConfig from './config.local'
import testnetConfig from './config.testnet'
import mainnetConfig from './config.mainnet'

const configs = {
    local: localConfig,
    testnet: testnetConfig, 
    mainnet: mainnetConfig
}

const getConfig = (name: 'local' | 'testnet' | 'mainnet') => {
    return configs[name]
}

export default getConfig