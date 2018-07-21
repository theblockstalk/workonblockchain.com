const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email) {
    const sendTo = {
        email: email,
        name: "NAME OF RECIPIENT - NEED TO ADD THIS!!!"
    };
    const subject = "New Message in Your Chat";

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : sendTo.email,
        subject: subject,
        text : 'You have new message in your chat box. Please see the incoming messages.',
        html : '<p>Hi '+email+'</p> <br/> <p> You have new message in your chat box. Please see the incoming messages.'
    };

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-chat-reminder",
        message: {
            global_merge_vars: [],
            subject: subject,
            to: sendToArray
        }
    };

    emails.sendEmail(nodemonOptions, mandrillOptions);
}