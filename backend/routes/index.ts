import type { AppType } from "../types/Types";
import accountRouter  from './account'
import getConfig from "../config/configuration";

const platform = process.env.PLATFORM || 'mainnet'
const config = getConfig(platform as 'local' | 'testnet' | 'mainnet')
const apiPrefix = config.apiPrefix

const initRoutes = (app: AppType) => {
    // app.get("/", (req: Request, res: Response) => {
    //         res.send("Express + TypeScript Server!!!");
    // });
    app.use(apiPrefix + '/accounts', accountRouter)
}

export default initRoutes