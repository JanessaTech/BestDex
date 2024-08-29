import config  from "./config.defaut"

const testnetConfig = {...config}
testnetConfig.env = 'testnet'
testnetConfig.database.dataBaseName = config.env

export default testnetConfig