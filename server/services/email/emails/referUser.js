const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    const sendTo = {
        email: data.email,
        name: "NAME OF RECIPIENT - NEED TO ADD THIS!!!"
    };
    const subject = "Referring a user";

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : sendTo.email,
        subject: subject,
        text : data.body,
        html : data.body
    };

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-refer-a-user",
        message: {
            global_merge_vars: [],
            subject: subject,
            to: sendToArray
        }
    };

    emails.sendEmail(nodemonOptions, mandrillOptions);
}