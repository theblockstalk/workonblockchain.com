const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    let mailOptions = {
        from: 'workonblockchain@mwancloud.com',
        to : data.email, // 'sadiaabbas326@gmail.com',//
        subject : "Welcome to TEST",
        text : 'Visit this http://workonblockchain.mwancloud.com/reset_password?hash='+data.password_key,
        html : '<p>Hi '+data.email+'</p> <br/> <p> You have requested to change your account password for workonblockchain.com. </p><br/><p>Please click on the link below in the next 30 minutes and then enter your new password.</p><br/><a href="http://workonblockchain.mwancloud.com/reset_password?hash='+data+'"><H2>Reset Password</H2></a><p>If you cannot click on the link, please copy and paste it into your browser.</p><br/><p>Thanks,</p><p> Work on Blockchain team!</p>'
    };

    emails.sendEmail(mailOptions);
}