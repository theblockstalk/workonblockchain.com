const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(emailAddress,firstName,verifyEmailToken) {

    const verifyEmailUrl = settings.CLIENT.URL + 'verify_email?email_hash='+verifyEmailToken;

    const sendTo = {
        email: emailAddress
    };
    const subject = "Please verify your email on Work on Blockchain";

    const sendToArray = [sendTo];

    const sendGridOptions = {
        templateId: "d-4564d4d9fec8469c8dfe0298511e8e17",
        subject: subject,
        personalizations: [{
            to: {
                email: emailAddress,
                name: firstName
            }
        }],
        templateData: {
            firstName: firstName,
            verifyEmailUrl: verifyEmailUrl
        }
    };

    emails.sendEmail(sendGridOptions, false);
}