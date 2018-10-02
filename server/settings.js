let settings = {};
let config;

if (process.env.NODE_ENV === 'production') {
    settings.ENVIRONMENT = 'production';
    config = require('./config/production.json');
} else if (process.env.NODE_ENV === 'staging') {
    settings.ENVIRONMENT = 'staging';
    config = require('./config/staging.json');
} else {
    process.env.NODE_ENV = 'test';
    settings.ENVIRONMENT = 'test';
    config = require('./config/default.json');
}

function isLiveApplication() {
    return settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging'
}

settings.isLiveApplication = isLiveApplication;

if (isLiveApplication()) {
    config.mongo.username = process.env.MONGO_DATABASE_USERNAME;
    config.mongo.password = process.env.MONGO_DATABASE_PASSWORD;

    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.mongo.username + ":"
        + config.mongo.password + "@" + config.mongo.host + ":"
        + config.mongo.port + "/" + config.mongo.databaseName
        + "?" + config.mongo.options;

    settings.AWS = {
        REGION: config.aws.region,
        BUCKETS: config.aws.buckets,
        ACCESS_KEY: config.aws.accessKey,
        SECRET_ACCESS_KEY: config.aws.secretAccessKey
    }

    settings.MANDRILL = {
        FROM_ADDRESS: config.mandrill.fromAddress,
        FROM_NAME: config.mandrill.fromName,
        API_KEY: config.mandrill.apiKey
    };
} else {
    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.mongo.host + ":"
        + config.mongo.port + "/" + config.mongo.databaseName;

    settings.FILE_URL = 'http://localhost/workonblockchain.com/server/uploads/';
}

settings.CRON = {
    UNREAD_MESSAGES_TICK: config.cron.unreadMessagesTick
};

settings.EXPRESS_JWT_SECRET = config.expressJwt.secret;

settings.CURRENCY_RATES = config.currencyRates;
settings.COMPANY_EMAIL_BLACKLIST = config.companyEmailBlacklist;

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
