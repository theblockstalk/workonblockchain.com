const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email) {
    const sendTo = email;
    const subject = "New Message in Your Chat";

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : sendTo,
        subject: subject,
        text : 'You have new message in your chat box. Please see the incoming messages.',
        html : '<p>Hi '+email+'</p> <br/> <p> You have new message in your chat box. Please see the incoming messages.'
    };

    const mandrillOptions = {
        templateName: "wob-chat-reminder",
        message: {
            global_merge_vars: [],
            subject: subject,
            to: sendTo
        }
    };

    emails.sendEmail(nodemonOptions, mandrillOptions);
}