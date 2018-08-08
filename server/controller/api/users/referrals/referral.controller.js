var Q = require('q');
const referUserEmail = require('../../../services/email/emails/referUser');
const logger = require('../../../services/logger');

//to send email for referral

module.exports = function (req, res) {
    refreal_email(req.body).then(function (data){
        console.log('done');
        res.json(data);
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function refreal_email(data){
    var deferred = Q.defer();
    referUserEmail.sendEmail(data)
    deferred.resolve('Email has been sent successfully.');
    return deferred.promise;
}
