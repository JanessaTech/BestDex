import mongoose from 'mongoose'
import logger from '../helpers/logger'
import getConfig from '../config/configuration'

const config = getConfig()
const dbURI = `mongodb://${config.database.host}:${config.database.port}/${config.database.dataBaseName}`
const options = {
    autoIndex: true,
    minPoolSize: config.database.minPoolSize, 
    maxPoolSize: config.database.maxPoolSize, 
    connectTimeoutMS: config.database.connectTimeoutMS, 
    socketTimeoutMS: config.database.socketTimeoutMS, 
  };

mongoose.connect(dbURI, options)
.then(() => {
    logger.info('Mongoose connection done')
})
.catch((e) => {
    logger.info('Mongoose connection error');
    logger.error(e);
})

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.once('open', () => {
    logger.info(dbURI)
    logger.info('Connected to the database.')
});
// If the connection throws an error
mongoose.connection.on('error', (err) => {
    logger.debug(dbURI)
    logger.error(`Database error: ${err}`)
    process.exit()
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected');
  });

export default mongoose.connection
