const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    let mailOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : data.email, //'sadiaabbas326@gmail.com',
        subject : "Welcome to TEST",
        text : 'Visit this http://workonblockchain.mwancloud.com/verify_email?email_hash='+data.token,
        html : '<p>Hi '+data.email+'</p> <br/> <p> Welcome to the new house of blockchain wizards and nerds! </p><br/><p>workonblockchain.com is the coolest and best way to get into a blockchain project.</p><br/><p>Please click on the link below to verify your email for workonblockchain.com.</p><br/><a href="http://workonblockchain.mwancloud.com/verify_email?email_hash='+data.token+'"><H2>Verify Email</H2></a><p>If you cannot click on the link, please copy and paste it into your browser.</p><br/><p>Thanks,</p><p> Work on Blockchain team!</p>'
		
    };

    emails.sendEmail(mailOptions);
}