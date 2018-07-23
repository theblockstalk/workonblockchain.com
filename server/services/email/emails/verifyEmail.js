const emails = require('../emails');
const settings = require('../../../settings');

module.exports.sendEmail = function sendEmail(data,first_name) {
    const verifyEmailUrl = settings.CLIENT.URL + '/verify_email?email_hash='+data.token;
    const sendTo = {
        email: data.email,
        name: "NAME OF RECIPIENT - NEED TO ADD THIS!!!"
    };
    const subject = "Verify your email";

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com',
        to : sendTo.email,
        subject : subject,
        text : 'Visit this ' + verifyEmailUrl,
        html : '<p>Hi '+first_name +'</p> <br/> <p> Welcome to the new house of blockchain wizards and nerds! </p><br/><p>workonblockchain.com is the coolest and best way to get into a blockchain project.</p><br/><p>Please click on the link below to verify your email for workonblockchain.com.</p><br/><a href="' + verifyEmailUrl + '"><H2>Verify Email</H2></a><p>If you cannot click on the link, please copy and paste it into your browser.</p><br/><p>Thanks,</p><p> Work on Blockchain team!</p>'
    };

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-verify-email",
        message: {
            global_merge_vars: [
                {
                    "name": "EMAIL",
                    "content": sendTo
                },
                {
                    "name": "VERIFY_EMAIL_URL",
                    "content": verifyEmailUrl
                }
            ],
            subject: subject,
            to: sendToArray
        }
    };

    emails.sendEmail(nodemonOptions, mandrillOptions);
}