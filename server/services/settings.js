const config = require('config');

let settings = {};

if (process.env.NODE_ENV === 'production') {
    settings.ENVIRONMENT = 'production';
} else if (process.env.NODE_ENV === 'staging') {
    settings.ENVIRONMENT = 'staging';
} else if (process.env.NODE_ENV === 'test') {
    settings.ENVIRONMENT = 'test';
} else {
    process.env.NODE_ENV = 'test';
    settings.ENVIRONMENT = 'test';
}

if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.get('mongo.username') + ":"
        + config.get('mongo.password') + "@" + config.get('mongo.host') + ":"
        + config.get('mongo.port') + "/" + config.get('mongo.databaseName')
        + "?" + config.get('mongo.options');

    settings.AWS = {
        REGION: config.get("aws.region"),
        S3_BUCKET: config.get("aws.s3Bucket")
    }
} else {
    settings.MONGO_CONNECTION_STRING = "mongodb://" + config.get('mongo.host') + ":"
        + config.get('mongo.port') + "/" + config.get('mongo.databaseName');
}

settings.NODEMAILER = {
    AUTH: config.get('nodemailer.auth'),
    HOST: config.get('nodemailer.host'),
    PORT: config.get('nodemailer.port')
};

settings.EXPRESS_JWT_SECRET = config.get('expressJwt.secret');

let port;
if (port = process.env.PORT) {
    port = process.env.PORT;
} else {
    port = config.get('server.port');
}

settings.SERVER = {
    PORT: port
};

console.log('settings', settings);
module.exports = settings;