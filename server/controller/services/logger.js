const settings = require('../../settings');
const winston = require('winston');

let winstonLogger

if (settings.ENVIRONMENT === 'production') {
    winstonLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'info',
                // stringify: true,
                timestamp: true,
                // colorize: true,
                // prettyPrint: true,
                json: true
            })
        ]
    })
} else {
    winstonLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                stringify: true,
                timestamp: true,
                // colorize: true,
                prettyPrint: true,
                // json: true
            })
        ]
    })
}

module.exports = winstonLogger;

/*

The following functions can be called:

logger.error()
logger.warn()
logger.info()
logger.http()
logger.verbose()
logger.debug()
logger.silly()

 */