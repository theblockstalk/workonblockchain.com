const nodemailer = require('./nodemailer');
const settings = require('../settings');

module.exports.sendEmail = function sendEmail(mailOptions) {
    if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
        // We can do something else here
        nodemailer.sendEmail(mailOptions);
        //
    } else {
        nodemailer.sendEmail(mailOptions);
    }
}