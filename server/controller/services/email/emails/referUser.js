const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email, subject, htmlBody) {
    const sendTo = {
        email: email
    };
    const sendToArray = [sendTo];
	const new_message = htmlBody.replace(/\n/g, "<br>");  
	
    const mandrillOptions = {
        templateName: "wob-refer-a-user",
        message: {
            global_merge_vars: [{
                "name": "MESSAGE_BODY",
                "content": new_message
            }],
            subject: subject,
            to: sendToArray
        }
    };

    const sendGridOptions = {
        templateId: "d-39586637ba424da091b47dcb0e0bc8b5",
        subject: subject,
        personalizations: [{
            to: {
                email: email
            }
        }],
        templateData: {
            messageBody: new_message
        }
    };

    emails.sendEmail(mandrillOptions, sendGridOptions, false);
};