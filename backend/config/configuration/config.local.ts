import config  from "./config.defaut"

const localConfig = structuredClone(config) //deep clone
localConfig.env = 'local'
localConfig.database.dataBaseName = 'local'

export default localConfig