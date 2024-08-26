import config  from "./config.global"

const localConfig = {...config}

localConfig.env = 'local'

export default localConfig