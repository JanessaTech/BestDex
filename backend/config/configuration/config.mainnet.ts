import config  from "./config.defaut"

const mainnetConfig = structuredClone(config) //deep clone
mainnetConfig.env = 'mainnet'
mainnetConfig.database.dataBaseName = 'mainnet'

export default mainnetConfig