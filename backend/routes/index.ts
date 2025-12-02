import type { AppType } from "../helpers/types/Types";
import getConfig from "../config/configuration"
import accountRouter  from './account'
import userRouter from './user'
import siweRouter from './siwe'
import tokenPriceRouter from './tokenPrice'
import poolRouter from './pool'
import positionRouter from './position'
import transactionRouter from './transaction'
import configRouter from './config'

const config = getConfig()
const apiPrefix = config.apiPrefix

const initRoutes = (app: AppType) => {
    app.use(apiPrefix + '/accounts', accountRouter)
    app.use(apiPrefix + '/users', userRouter)
    app.use(apiPrefix + '/siwe', siweRouter)
    app.use(apiPrefix + '/price', tokenPriceRouter)
    app.use(apiPrefix + '/pool', poolRouter)
    app.use(apiPrefix + '/positions', positionRouter)
    app.use(apiPrefix + '/transactions', transactionRouter)
    app.use(apiPrefix + '/config', configRouter)
}

export default initRoutes