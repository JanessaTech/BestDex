import config  from "./config.default"

const localConfig = structuredClone(config) //deep clone
localConfig.env = 'local'

export default localConfig