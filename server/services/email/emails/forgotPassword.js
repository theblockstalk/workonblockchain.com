const emails = require('../emails');
const settings = require('../../../settings');

module.exports.sendEmail = function sendEmail(data,hash,name) {
    const sendTo = {
        email:data.email,
        name: "NAME OF RECIPIENT - NEED TO ADD THIS!!!"
    };
    const subject = "Forgot password on Work on Blockchain";

    // Which of the following is correct???
    // const resetPassswordUrl = settings.CLIENT.URL + '/reset_password?hash='+hash;
    const resetPassswordUrl = settings.CLIENT.URL + 'reset_password?hash='+hash;

    const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com',
        to : sendTo.email,
        subject : subject,
        text : 'Visit this ' + resetPassswordUrl,
        html : '<p>Hi '+name+'</p> <br/> <p> You have requested to change your account password for workonblockchain.com. </p><br/><p>Please click on the link below in the next 30 minutes and then enter your new password.</p><br/><a href="' + resetPassswordUrl + '"><H2>Reset Password</H2></a><p>If you cannot click on the link, please copy and paste it into your browser.</p><br/><p>Thanks,</p><p> Work on Blockchain team!</p>'
    };

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-forgot-password",
        message: {
        	 global_merge_vars: [
 				{FNAME : name},
 				{RESET_PASSWORD_URL  : resetPassswordUrl}
 			],
            subject: subject,
            to: sendToArray
        }
    };

    emails.sendEmail(nodemonOptions, mandrillOptions);
}