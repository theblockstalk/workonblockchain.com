const nodemailer = require('./nodemailer');

module.exports.sendEmail = function sendEmail(mailOptions) {
    nodemailer.sendEmail(mailOptions);
}