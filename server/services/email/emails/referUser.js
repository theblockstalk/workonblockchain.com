const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    const sendTo = data.email;
    const subject = "Referring a user";

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : sendTo,
        subject: subject,
        text : data.body,
        html : data.body
    };

    const mandrillOptions = {
        templateName: "wob-refer-a-user",
        message: {
            global_merge_vars: [],
            subject: subject,
            to: sendTo
        }
    };

    emails.sendEmail(nodemonOptions, mandrillOptions);
}