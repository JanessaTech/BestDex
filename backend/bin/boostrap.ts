import http from 'http'
import app from '../app'
import dotenv from "dotenv"
import getConfig from '../config/configuration'
import logger from '../helpers/logger'

dotenv.config();

const platform = process.env.PLATFORM || 'mainnet'
logger.info('process.env.PLATFORM = ', platform)

const config = getConfig(platform as 'local' | 'testnet' | 'mainnet')
if (!config) {
    logger.error('config is empty.The valid values for PLATFORM in .env should be local, testnet, mainnet')
    process.exit()
}

const server = http.createServer(app)
logger.info(`Environment type: ${config?.env}`)

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

