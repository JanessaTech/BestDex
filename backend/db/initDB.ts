import mongoose from 'mongoose'
import logger from '../helpers/logger'
import getConfig from '../config/configuration'

export async function connectDB() {
    const config = getConfig()
    //const dbURI = `mongodb://${config.database.host}:${config.database.port}/${config.database.dataBaseName}`
    const dbURI = `mongodb://${config.database.username}:${config.database.password}@127.0.0.1:${config.database.port}/${config.database.dataBaseName}?authSource=${config.database.dataBaseName}`
    logger.debug('dbURI =', dbURI)
    const options = {
        autoIndex: true,
        minPoolSize: config.database.minPoolSize, 
        maxPoolSize: config.database.maxPoolSize, 
        connectTimeoutMS: config.database.connectTimeoutMS, 
        socketTimeoutMS: config.database.socketTimeoutMS, 
      };
    mongoose.connection.once('open', () => {
        logger.info(dbURI)
        logger.info('Connected to the database.')
    });
    mongoose.connection.on('error', (err) => {
        logger.debug(dbURI)
        logger.error(`Database error: ${err}`)
        process.exit()
    });
    mongoose.connection.on('disconnected', () => {
        logger.info('Mongoose default connection disconnected');
      });

    try {
    await mongoose.connect(dbURI, options)
    logger.info('Mongoose connection done')
    } catch (err) {
    logger.info('Mongoose connection error');
    logger.error(err);
    }
}
