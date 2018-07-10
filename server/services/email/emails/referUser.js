const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    let mailOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : 'sadiaabbas326@gmail.com',
        subject : data.subject,
        text : data.body,
        html : data.body
    };

    emails.sendEmail(mailOptions);
}