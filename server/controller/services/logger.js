const settings = require('../../settings');
const winston = require('winston');
const slackHook = require('winston-slack-hook');
const WinstonCloudWatch = require('winston-cloudwatch')

let slackWebhook, cloudWatch;

if (settings.isLiveApplication()) {
    cloudWatch = new WinstonCloudWatch({
        level: 'debug',
        awsRegion: settings.AWS.REGION,
        jsonMessage: true,
        retentionInDays: 30,
        logGroupName: settings.AWS.CLOUDWATCH.GROUP,
        logStreamName: settings.AWS.CLOUDWATCH.STREAM
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
                level: 'debug',
                timestamp: true,
                json: true
            }),
            cloudWatch,
            slackWebhook
        ]
    })
} else if (settings.ENVIRONMENT === 'staging') {
    winstonLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'silly',
                timestamp: true,
                json: true
            }),
            cloudWatch,
            slackWebhook
        ]
    })
} else {
    winstonLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'silly',
                json: true
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