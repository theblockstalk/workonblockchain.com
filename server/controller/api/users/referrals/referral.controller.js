var Q = require('q');
const referUserEmail = require('../../../services/email/emails/referUser');
const logger = require('../../../services/logger');
const sanitizer = require('../../../middleware/sanitizer');

//to send email for referral

module.exports = function (req, res) {
    let sanitizedHtmlBody = sanitizer.sanitizeHtml(req.unsanitizedBody.body)
    refreal_email(req.body, sanitizedHtmlBody).then(function (data){
        
        res.json(data);
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function refreal_email(data, htmlBody){
    var deferred = Q.defer();
    referUserEmail.sendEmail(data.email, data.subject, htmlBody);
    deferred.resolve('Email has been sent successfully.');
    return deferred.promise;
}
