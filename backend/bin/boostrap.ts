import http from 'http'
import app from '../app'
import dotenv from "dotenv"
dotenv.config();
import getConfig from '../config/configuration'
import logger from '../helpers/logger'
import banner from '../helpers/banner'
import '../config/data/hardcode'
import '../db/initDB'  // connected to db
import { WebsocketServer } from '../infra/websocket/WebsocketServer';
import initInfra from '../infra'
import cors from 'cors'

initInfra(app)

const corsOptions = {
    origin: [
      'https://best-dex-yiiv.vercel.app/',
      'http://localhost:3000'
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions))

const config = getConfig()
logger.info(`Environment type: ${config?.env}`)

const server = http.createServer(app)
const websocketServer = new WebsocketServer(server)
app.set('websocketServer', websocketServer);

const onListening = () => {
    const address = server.address()
    const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${address?.port}`;
    logger.info('Server is listening on ' + bind)
}

logger.info('Register listening event handler')
server.on('listening', onListening)
const port = config.port
logger.info(`Server Port : ${port}`)

const start = (port: number) => {
    try {
        logger.info('Start server...')
        server.listen(port);
    } catch (e: unknown) {
        if (e instanceof Error) {
            logger.error(`Failed to start server due to : ${e.message}`)
        }
        process.exit()
    }
}

start(port)
logger.info(banner)

