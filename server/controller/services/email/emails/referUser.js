const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email, subject, htmlBody) {
    const sendTo = {
        email: email
    };
    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-refer-a-user",
        message: {
            global_merge_vars: [{
                "name": "MESSAGE_BODY",
                "content": htmlBody
            }],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}