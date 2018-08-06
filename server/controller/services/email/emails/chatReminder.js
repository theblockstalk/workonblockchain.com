const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email,first_name) {
    const sendTo = {
        email: email
    };
    const subject = "You have a new message on Work on Blockchain";

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-chat-reminder",
        message: {
            global_merge_vars: [{
                "name": "FNAME",
                "content": first_name
            }],
            subject: subject,
            to: sendToArray
        }
    };

    emails.sendEmail(mandrillOptions);
}