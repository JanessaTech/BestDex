import config  from "./config.defaut"

const mainnetConfig = {...config}
mainnetConfig.env = 'mainnet'
mainnetConfig.database.dataBaseName = config.env

export default mainnetConfig