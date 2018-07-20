const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data,hash) {
    const sendTo = data.email;
    const subject = "Forgot your password?";

    // Which of the following is correct???
    // const resetPassswordUrl = 'http://workonblockchain.mwancloud.com/reset_password?hash='+hash;
    const resetPassswordUrl = 'http://workonblockchain.mwancloud.com/reset_password?hash='+data.password_key;

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com',
        to : sendTo,
        subject : subject,
        text : 'Visit this ' + resetPassswordUrl,
        html : '<p>Hi '+sendTo+'</p> <br/> <p> You have requested to change your account password for workonblockchain.com. </p><br/><p>Please click on the link below in the next 30 minutes and then enter your new password.</p><br/><a href="' + resetPassswordUrl + '"><H2>Reset Password</H2></a><p>If you cannot click on the link, please copy and paste it into your browser.</p><br/><p>Thanks,</p><p> Work on Blockchain team!</p>'
    };

    const mandrillOptions = {
        templateName: "wob-forgot-password",
        message: {
            global_merge_vars: [
                {
                    "name": "RESET_PASSWORD_URL",
                    "content": resetPassswordUrl
                }
            ],
            subject: subject,
            to: sendTo
        }
    };

    emails.sendEmail(nodemonOptions, mandrillOptions);
}