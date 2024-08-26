import http from 'http'
import app from '../app'
import dotenv from "dotenv"
import getConfig from '../config/configuration';

dotenv.config();

const env = process.env.PLATFORM || 'local'
console.log('process.env.PORT = ', process.env.PORT)

const server = http.createServer(app)
console.log('Server is created')
console.log(`Environment type: ${getConfig(env as 'local' | 'testnet' | 'mainnet')?.env}`)

const onListening = () => {
    const address = server.address()
    const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${address?.port}`;
    console.log('Server is listening on ' + bind)
}

console.log('Register listening event handler')
server.on('listening', onListening)
const port = Number(process.env.PORT) || 3000;

const start = (port: number) => {
    try {
        console.log('Start server...')
        server.listen(port);
    } catch (e) {
        //console.log(`Failed to start server due to : ${e.message}`)
        process.exit()
    }
}

start(port)

