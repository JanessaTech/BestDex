import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import initRoutes from './routes'
import initGlobalErrorHandlers from "./routes/base_errors/GlobleErrorHandlers"
import getConfig from "./config/configuration"

const app = express()
const config = getConfig()

//define where to upload profile file to. we could access to these files under the dir by http://localhost:3100/file.png (file.png is the file under the dir)
app.use(express.static(`${config.staticDirs.profiles}/${config.env}`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

//app.use('/', routes);
initRoutes(app);
initGlobalErrorHandlers(app)

export default app