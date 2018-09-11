const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,hash,name) {
    const sendTo = {
        email:data.email
    };
    const subject = "Forgot password on Work on Blockchain";

    const resetPassswordUrl = settings.CLIENT.URL + 'reset_password?hash='+hash;
    const sendToArray = [sendTo];
    logger.debug('reset url: ' + resetPassswordUrl);
    const mandrillOptions = {
        templateName: "wob-forgot-password",
        message: {
        	 global_merge_vars: [{
        	     "name": "FNAME",
                 "content": name
             }, {
        	     "name": "RESET_PASSWORD_URL",
                 "content": resetPassswordUrl
        	 }],
            subject: subject,
            to: sendToArray
        }
    };
    
    logger.debug('mandril options: ' + mandrillOptions);

	emails.sendEmail(mandrillOptions);
}