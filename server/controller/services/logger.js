const settings = require('../../settings');
const winston = require('winston');
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
const slackHook = require('winston-slack-hook');

let s3Transport, slackWebhook;

if (settings.isLiveApplication()) {
    const s3_stream = new S3StreamLogger({
        bucket: settings.AWS.BUCKETS.logs,
        folder: settings.ENVIRONMENT + "/application/nodejs",
        access_key_id: settings.AWS.ACCESS_KEY,
        secret_access_key: settings.AWS.SECRET_ACCESS_KEY
    });

    s3Transport = new (winston.transports.File)({
        stream: s3_stream
    });

    slackWebhook = new slackHook({
        level: 'error',
        hookUrl: settings.SLACK.WEBHOOK,
        username: settings.SLACK.USERNAME,
        channel: settings.SLACK.CHANNEL
    })
}


let winstonLogger;

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
            }),
            slackWebhook,
            s3Transport
        ]
    })
} else if (settings.ENVIRONMENT === 'staging') {
    winstonLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                // stringify: true,
                timestamp: true,
                // colorize: true,
                // prettyPrint: true,
                json: true
            }),
            slackWebhook,
            s3Transport
        ]
    })
} else {
    winstonLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                // stringify: true,
                // timestamp: true,
                // colorize: true,
                // prettyPrint: true,
                // prettyPrint: JSON.stringify,
                // json: true,
                // format: winston.format(genericFormatter)(),
                // prettyPrint: function ( object ){
                //     return JSON.stringify(object);
                // },
                // handleExceptions: true,
                json: true,
                // colorize: true
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

format:
logger.debug("I am a string")
metadata = { info: "More information" }
logger.debug("Message description", metadata)
 */