const nodemailer = require('./nodemailer');
const mandrill = require('./mandrill');
const settings = require('../settings');

module.exports.sendEmail = function sendEmail(nodemonOptions, mandrillOptions) {
    if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
        mandrill.sendEmail(mandrillOptions);
    } else {
		nodemailer.sendEmail(nodemonOptions);
    }
}