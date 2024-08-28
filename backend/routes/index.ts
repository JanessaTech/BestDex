import type { AppType } from "../types/Types";
import accountRouter  from './account'
import getConfig from "../config/configuration";

const config = getConfig()
const apiPrefix = config.apiPrefix

const initRoutes = (app: AppType) => {
    app.use(apiPrefix + '/accounts', accountRouter)
}

export default initRoutes