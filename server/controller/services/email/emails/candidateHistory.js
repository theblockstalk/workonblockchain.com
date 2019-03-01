const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email,name,email_text,isAccountDisabed) {
    const sendTo = {
        email:email
    };
    const subject = "Your account has been approved!";

    const sendToArray = [sendTo];


    const sendGridOptions = {
        templateId: "b07d4ca90da44fb2843d59796edc0dd3",
        subject: subject,
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