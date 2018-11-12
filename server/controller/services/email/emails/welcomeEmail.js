const emails = require('../emails');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,isAccountDisabed) {
    const sendTo = {
        email: data.email
    };
    const subject = 'Welcome to Work on Blockchain!';
    const sendToArray = [sendTo];
    logger.debug('refeered email: ' , data.email);
    const mandrillOptions = {
        templateName: "wob-welcome",
        message: {
            global_merge_vars: [{
                "name": "FNAME",
                "content": data.fname
            }],
            subject: subject,
            to: sendToArray
        }
    };

    const sendGridOptions = {
        templateId: "d-dfcec8a2110d4c5da64894b1be238b15",
        subject: subject,
        personalizations: [{
            to: {
                email: data.email,
                name: data.fname
            }
        }],
        templateData: {
            firstName: data.fname
        }
    };

    emails.sendEmail(mandrillOptions, sendGridOptions, false);
}