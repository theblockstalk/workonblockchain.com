let settings = {};
let config;

if (process.env.NODE_ENV === 'production') {
    settings.ENVIRONMENT = 'production';
    config = require('./config/production.json');
} else if (process.env.NODE_ENV === 'staging') {
    settings.ENVIRONMENT = 'staging';
    config = require('./config/staging.json');
} else if (process.env.NODE_ENV === 'migrate') {
    settings.ENVIRONMENT = 'migrate';
    config = require('./config/default.json');
} else {
    process.env.NODE_ENV = 'test';
    settings.ENVIRONMENT = 'test';
    config = require('./config/default.json');
}

const isLiveApplication = settings.isLiveApplication = function () {
    return settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging'
}

if (isLiveApplication()) {
    config.mongo.username = process.env.MONGO_DATABASE_USERNAME;
    config.mongo.password = process.env.MONGO_DATABASE_PASSWORD;
    config.expressJwt = {
        secret: process.env.EXPRESS_JWT_SECRET
    };
    config.sendGrid.apiKey = process.env.SENDGRID_API_KEY;

    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.mongo.username + ":"
        + config.mongo.password + "@" + config.mongo.host + ":"
        + config.mongo.port + "/" + config.mongo.databaseName
        + "?" + config.mongo.options;

    settings.AWS = {
        REGION: config.aws.region,
        BUCKETS: config.aws.buckets,
        CLOUDWATCH: {
            GROUP: config.aws.cloudWatch.group,
            STREAM: config.aws.cloudWatch.stream
        }
    };

    settings.SENDGRID = {
        FROM_ADDRESS: config.sendGrid.fromAddress,
        FROM_NAME: config.sendGrid.fromName,
        API_KEY: config.sendGrid.apiKey,
        ACCOUNT_FROM_ADDRESS: config.sendGrid.accountFromAddress ,
        ACCOUNT_FROM_NAME: config.sendGrid.accountFromName
    };

    settings.throttleTime = config.sendGrid.throttleTime;


    settings.SLACK = {
        WEBHOOK: process.env.SLACK_WEBHOOK,
        USERNAME: config.slack.username,
        CHANNEL: config.slack.channel
    };

    settings.AMPLITUDE = {
        API_KEY: process.env.AMPLITUDE_API_KEY,
        SECRET_API_KEY: process.env.AMPLITUDE_SECRET_API_KEY
    }
} else if (settings.ENVIRONMENT === 'migrate') {
    settings.MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

    settings.FILE_URL = 'http://localhost/workonblockchain.com/server/uploads/';
} else {
    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.mongo.host + ":"
        + config.mongo.port + "/" + config.mongo.databaseName;

    settings.FILE_URL = 'http://localhost/workonblockchain.com/server/uploads/';
    settings.SENDGRID = {
        ACCOUNT_FROM_ADDRESS: config.sendGrid.accountFromAddress ,
        ACCOUNT_FROM_NAME: config.sendGrid.accountFromName
    };
}

settings.CRON = {
    UNREAD_MESSAGES_TICK: config.cron.unreadMessagesTick,
    AUTO_NOTIFICATION: config.cron.autoNotification,
    SYNC_SENDGRID: config.cron.syncSendgrid
};


settings.EXPRESS_JWT_SECRET = config.expressJwt.secret;

settings.CURRENCY_RATES_USD = config.currencyRatesUSD;

let port;
if (port = process.env.PORT) {
    port = process.env.PORT;
} else {
    port = config.server.port;
}

settings.SERVER = {
    PORT: port
};

settings.CLIENT = {
    URL: config.client.url
};

module.exports = settings;
