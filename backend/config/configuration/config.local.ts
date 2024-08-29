import config  from "./config.defaut"

const localConfig = {...config}
localConfig.env = 'local'
localConfig.database.dataBaseName = config.env

export default localConfig