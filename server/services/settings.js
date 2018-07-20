let settings = {};
let config;

if (process.env.NODE_ENV === 'production') {
    settings.ENVIRONMENT = 'production';
    config = require('../config/production.json');
} else if (process.env.NODE_ENV === 'staging') {
    settings.ENVIRONMENT = 'staging';
    config = require('../config/staging.json');
} else if (process.env.NODE_ENV === 'test') {
    settings.ENVIRONMENT = 'test';
    config = require('../config/default.json');
} else {
    process.env.NODE_ENV = 'test';
    settings.ENVIRONMENT = 'test';
    config = require('../config/default.json');
}

if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.mongo.username + ":"
        + config.mongo.password + "@" + config.mongo.host + ":"
        + config.mongo.port + "/" + config.mongo.databaseName
        + "?" + config.mongo.options;

    settings.AWS = {
        REGION: config.aws.region,
        S3_BUCKET: config.aws.s3Bucket,
        ACCESS_KEY: config.aws.accessKey,
        SECRET_ACCESS_KEY: config.aws.secretAccessKey
    }
} else {
    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.mongo.host + ":"
        + config.mongo.port + "/" + config.mongo.databaseName;
}

settings.NODEMAILER = {
    AUTH: config.nodemailer.auth,
    HOST: config.nodemailer.host,
    PORT: config.nodemailer.port
};

settings.EXPRESS_JWT_SECRET = config.expressJwt.secret;

let port;
if (port = process.env.PORT) {
    port = process.env.PORT;
} else {
    port = config.server.port;
}

settings.SERVER = {
    PORT: port
};

console.log('settings', settings);
module.exports = settings;