const emails = require('../emails');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,isAccountDisabed) {
    const sendTo = {
        email: data.email
    };
    const subject = 'Welcome to Work on Blockchain!';
    const sendToArray = [sendTo];
    logger.debug('refeered email: ' , data.email);
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

    emails.sendEmail(mandrillOptions,isAccountDisabed);
}