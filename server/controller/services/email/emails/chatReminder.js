const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email, isAccountDisabed, first_name) {
    const sendTo = {
        email: email
    };
    const subject = "You have a new message on Work on Blockchain";

    const sendToArray = [sendTo];

    const sendGridOptions = {
        templateId: "d-145e76ac958041c792167113892f9cea",
        subject: subject,
        personalizations: [{
            to: {
                email: email,
                name: first_name
            }
        }],
        templateData: {
            firstName: first_name
        }
    };

    emails.sendEmail(sendGridOptions, isAccountDisabed);
}