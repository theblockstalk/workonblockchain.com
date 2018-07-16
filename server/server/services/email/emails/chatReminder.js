const emails = require('../emails');

module.exports.sendEmail = function sendEmail(email) {
    let mailOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : email, //'sadiaabbas326@gmail.com',
        subject : "New Message in Your Chat",
        text : 'You have new message in your chat box. Please see the incoming messages.',
        html : '<p>Hi '+email+'</p> <br/> <p> You have new message in your chat box. Please see the incoming messages.'
    };

    emails.sendEmail(mailOptions);
}