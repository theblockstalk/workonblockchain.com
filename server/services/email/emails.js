const nodemailer = require('./nodemailer');
const mandrill = require('./mandrill');
const settings = require('../../settings');

module.exports.sendEmail = function sendEmail(nodemonOptions, mandrillOptions) {
    if (settings.isLiveApplication()) {
        mandrill.sendEmail(mandrillOptions);
    } else {
		nodemailer.sendEmail(nodemonOptions);
    }
}