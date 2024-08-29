import config  from "./config.defaut"

const testnetConfig = structuredClone(config) //deep clone
testnetConfig.env = 'testnet'
testnetConfig.database.dataBaseName = 'testnet'

export default testnetConfig