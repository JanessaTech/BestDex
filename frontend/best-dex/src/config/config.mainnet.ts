import config  from "./config.default"

const mainnetConfig = structuredClone(config) //deep clone
mainnetConfig.env = 'mainnet'

export default mainnetConfig