const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email, isAccountDisabed, first_name) {
    const sendTo = {
        email: email
    };
    const subject = "You have a new message on Work on Blockchain";

    const sendToArray = [sendTo];

    const sendGridOptions = {
        templateId: "d-f2d1ae593663458e99a369ffc1bbcaa4",
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