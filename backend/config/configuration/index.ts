import localConfig from './config.local'
import testnetConfig from './config.testnet'
import mainnetConfig from './config.mainnet'

const getConfig = () => {
    const platform = process.env.PLATFORM || 'mainnet'
    if (platform === 'local') {
        return localConfig
    } else if (platform === 'testnet') {
        return testnetConfig
    }
    return mainnetConfig
}

export default getConfig