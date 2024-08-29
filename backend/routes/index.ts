import type { AppType } from "../helpers/types/Types";
import accountRouter  from './account'
import userRouter from './user'
import getConfig from "../config/configuration";

const config = getConfig()
const apiPrefix = config.apiPrefix

const initRoutes = (app: AppType) => {
    app.use(apiPrefix + '/accounts', accountRouter)
    app.use(apiPrefix + '/users', userRouter)
}

export default initRoutes