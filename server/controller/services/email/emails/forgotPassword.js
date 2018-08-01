const emails = require('../emails');
const settings = require('../../../../settings');

module.exports.sendEmail = function sendEmail(data,hash,name) {
    const sendTo = {
        email:data.email
    };
    const subject = "Forgot password on Work on Blockchain";

    const resetPassswordUrl = settings.CLIENT.URL + 'reset_password?hash='+hash;

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-forgot-password",
        message: {
        	 global_merge_vars: [
 				{FNAME : name},
 				{RESET_PASSWORD_URL  : resetPassswordUrl}
 			],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}