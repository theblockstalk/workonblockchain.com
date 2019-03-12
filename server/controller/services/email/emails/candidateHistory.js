const emails = require('../emails');
const settings = require('../../../../settings');

module.exports.sendEmail = function sendEmail(email,name,emailSubject,email_text,isAccountDisabed) {
    const sendTo = {
        email:email
    };
    const subject = emailSubject;

    const sendToArray = [sendTo];


    const sendGridOptions = {
        templateId: "b07d4ca90da44fb2843d59796edc0dd3",
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