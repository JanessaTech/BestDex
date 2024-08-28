import winston from 'winston'
import {format} from 'winston'

const logLevel = getLogLevel(process.env.PLATFORM)

const isJson = (obj: any) => {
    return obj !== undefined && obj !== null && obj.constructor === Object;
}

const isArray = (obj: any) => {
    return !!obj && obj.constructor === Array;
}

const isSet = (obj: any) => {
    return !!obj && obj.constructor === Set;
}

const convert = (obj: any): any => {
    if (isJson(obj)) {
       return  '\n' + JSON.stringify(obj, null, 4)
    }
    if (isArray(obj)) {
        return obj.map((o: any) => convert(o))
    }
    if (isSet(obj)) {
        return [...obj].map((o: any) => convert(o))
    }
    return obj
}

const customFormat = {
    transform(info: any) {
        const { timestamp, message } = info;
        const level = info[Symbol.for('level')];
        const others = info[Symbol.for('splat')];
        //const args = others? others.map( e => isJson(e) ? '\n' + JSON.stringify(e, null, 4) + '\n' : e).join(' ') : others
        const args = others ? others.map( (e: any) => convert(e)).join(' ') : others
        info[Symbol.for('message')] = args?  `${timestamp}  ${level}: ${message} ${args}` :  `${timestamp}  ${level}: ${message}`;
        return info;
    }
}

const logger = winston.createLogger({
    level: logLevel,  // log levels are : error , warn, info, verbose, debug, silly. If we set te level to be info, logs which are error/warn/info will be printed out
    format: winston.format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        //format.splat(),
        //format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        customFormat
    ),
    transports: [
        new winston.transports.Console({silent: process.env.JEST_ENABLED === 'yes'}),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

function getLogLevel(platform: string | undefined) {
    switch (platform) {
        case 'local' : return 'debug'
        case 'testnet' : return 'debug'
        case 'mainet' : return 'debug'
        default: return 'info'
    }
}

export default logger