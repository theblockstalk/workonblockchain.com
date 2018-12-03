const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email, subject, htmlBody) {
    const sendTo = {
        email: email
    };
    const sendToArray = [sendTo];
	const new_message = htmlBody.replace(/\n/g, "<br>");

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

    emails.sendEmail(sendGridOptions, false);
};