const emails = require('../emails');
const settings = require('../../../../settings');

module.exports.sendEmail = function sendEmail(email,name,emailSubject,email_text,isAccountDisabed) {
    const subject = emailSubject;

    const sendGridOptions = {
        templateId: "d8830894f2ac46d6af1b57abdf8d4ac5",
        subject: subject,
        from: {
            name: settings.SENDGRID.ACCOUNT_FROM_NAME,
            email: settings.SENDGRID.ACCOUNT_FROM_ADDRESS
        },
        personalizations: [{
            to: {
                email: email,
                name: name
            }
        }],
        templateData: {
            body: email_text,
        }
    };

    emails.sendEmail(sendGridOptions, isAccountDisabed);
}