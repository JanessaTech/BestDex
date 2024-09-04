import config  from "./config.default"

const testnetConfig = structuredClone(config) //deep clone
testnetConfig.env = 'testnet'

export default testnetConfig