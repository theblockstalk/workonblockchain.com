const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    const sendTo = {
        email: data.email
    };
    const subject = data.subject;

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-refer-a-user",
        message: {
            global_merge_vars: [{
                "name": "MESSAGE_BODY",
                "content": data.body
            }],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}