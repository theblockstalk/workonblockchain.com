const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    const verifyUrl = 'http://workonblockchain.mwancloud.com/verify_email?email_hash='+data.token;
    const sendTo = data.email;
    const subject = "Welcome to TEST";

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com',
        to : sendTo,
        subject : subject,
        text : 'Visit this ' + verifyUrl,
        html : '<p>Hi '+sendTo+'</p> <br/> <p> Please click on the link below to verify your email for workonblockchain.com. </p><br/><a href="' + verifyUrl + '"><H2>Verify Email</H2></a><p>If you cannot click on the link, please copy and paste it into your browser.</p><br/><p>Thanks,</p><p> Work on Blockchain team!</p>'
    };

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
                    "content": verifyUrl
                }
            ],
            subject: subject,
            to: sendTo
        },
    }

    emails.sendEmail(nodemonOptions, mandrillOptions);
}