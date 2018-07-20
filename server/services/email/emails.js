const nodemailer = require('./nodemailer');
const mandrill = require('./mandrill');
const settings = require('../settings');

module.exports.sendEmail = function sendEmail(mailOptions) {
    if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
        mandrill.sendEmail(mailOptions);
    } else {
		nodemailer.sendEmail(mailOptions);
    }
}