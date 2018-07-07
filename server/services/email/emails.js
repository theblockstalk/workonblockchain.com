const nodemailer = require('./nodemailer');
const settings = require('../settings');

module.exports.sendEmail = function sendEmail(mailOptions) {
    if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {

    } else {
        nodemailer.sendEmail(mailOptions);
    }
}