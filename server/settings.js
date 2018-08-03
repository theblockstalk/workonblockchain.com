let settings = {};
let config;

if (process.env.NODE_ENV === 'production') {
    settings.ENVIRONMENT = 'production';
    config = require('./config/production.json');
} else if (process.env.NODE_ENV === 'staging') {
    settings.ENVIRONMENT = 'staging';
    config = require('./config/staging.json');
} else if (process.env.NODE_ENV === 'testing') {
    settings.ENVIRONMENT = 'testing';
    config = require('./config/testing.json');
} else {
    process.env.NODE_ENV = 'test';
    settings.ENVIRONMENT = 'test';
    config = require('./config/default.json');
}

function isLiveApplication() {
    return settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging' || settings.ENVIRONMENT === 'testing'
}

settings.isLiveApplication = isLiveApplication;

if (isLiveApplication()) {
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

    settings.NODEMAILER = {
        AUTH: config.nodemailer.auth,
        HOST: config.nodemailer.host,
        PORT: config.nodemailer.port
    };
}

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
