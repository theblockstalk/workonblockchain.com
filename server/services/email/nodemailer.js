const nodemailer = require('nodemailer');

module.exports.sendEmail = function sendEmail(mailOptions) {
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.mwancloud.com',
            port: 25,
            secure: false,
            tls:{
                rejectUnauthorized: false
            }, // true for 465, false for other ports
            auth: {
                user: 'workonblockchain@mwancloud.com',
                pass: 'e71$AGVy'
            }
        });

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error)
            {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}