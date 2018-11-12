const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(emailAddress,firstName,verifyEmailToken) {

    const verifyEmailUrl = settings.CLIENT.URL + 'verify_email?email_hash='+verifyEmailToken;
    console.log(verifyEmailUrl);
    logger.debug('verify email url: ' , verifyEmailUrl);

    const sendTo = {
        email: emailAddress
    };
    const subject = "Please verify your email on Work on Blockchain";

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-verify-email",
        message: {
        	 global_merge_vars: [{
        	     "name": "FNAME",
                 "content": firstName
             }, {
        	     "name": "VERIFY_EMAIL_URL",
                 "content": verifyEmailUrl
             }],
            subject: subject,
            to: sendToArray
        }
    };
    logger.debug('mandril options: ' , mandrillOptions);

    const sendGridOptions = {
        templateId: "d-1e975a9bf5524607a19b2b06f26a3e08",
        subject: subject,
        personalizations: [{
            to: {
                email: emailAddress,
                name: firstName
            }
        }],
        templateData: {
            firstName: firstName
        }
    };

    logger.debug('sendGid options: ' , sendGridOptions);

    emails.sendEmail(mandrillOptions, sendGridOptions, false);
}