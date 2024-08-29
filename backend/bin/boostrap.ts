import http from 'http'
import app from '../app'
import dotenv from "dotenv"
dotenv.config();
import getConfig from '../config/configuration'
import logger from '../helpers/logger'
import banner from '../helpers/banner'
import '../db/initDB'

const config = getConfig()
logger.info(`Environment type: ${config?.env}`)

const server = http.createServer(app)

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

