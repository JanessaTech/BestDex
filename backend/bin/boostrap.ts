import http from 'http'
import dotenv from "dotenv"
dotenv.config();
import getConfig from '../config/configuration'
import logger from '../helpers/logger'
import banner from '../helpers/banner'
import { WebsocketServer } from '../infra/websocket/WebsocketServer';
import { createApp } from '../appFactory';

async function bootstrap() {
    const config = getConfig()
    logger.info(`Environment type: ${config?.env}`)
    const app = await createApp();
    
    const server = http.createServer(app)
    const websocketServer = new WebsocketServer(server)
    app.set('websocketServer', websocketServer);

    const onListening = () => {
        const address = server.address()
        const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${address?.port}`;
        logger.info('Server is listening on ' + bind)
    }

    server.on('listening', onListening);
    const port = config.port;
    logger.info(`Server Port : ${port}`);
    
    try {
        logger.info('Start server...')
        server.listen(port);
    } catch (e: unknown) {
        if (e instanceof Error) {
            logger.error(`Failed to start server due to : ${e.message}`)
        }
        process.exit()
    }
    logger.info(banner)
}

bootstrap().catch(err => {
    logger.error('Bootstrap failed:', err);
    process.exit(1);
});



