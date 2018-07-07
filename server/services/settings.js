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

} else {
    settings.NODEMAILER = {
        AUTH: config.nodemailer.auth,
        HOST: config.nodemailer.host,
        PORT: config.nodemailer.port
    }
}

module.exports = settings;