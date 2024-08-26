import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import initRoutes from './routes'
const app = express()

//const config = require('./config/configuration')

//define where to upload profile file to. we could access to these files under the dir by http://localhost:3100/file.png (file.png is the file under the dir)
//app.use(express.static(`${config.staticDirs.profiles}/${config.env}`))


//const initGlobalErrorHandlers = require('./routes/base_errors/globleErrorHandlers')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

//app.use('/', routes);
initRoutes(app);
//initGlobalErrorHandlers(app)

export default app