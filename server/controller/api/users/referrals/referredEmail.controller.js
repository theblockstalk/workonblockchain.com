var Q = require('q');
const referedUserEmail = require('../../../services/email/emails/referredFriend');
const logger = require('../../../services/logger');

module.exports = function referred_email(req,res)
{
  
    referred_email_user(req.body).then(function (err, data)
    {
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });

}

function referred_email_user(data)
{
    var deferred = Q.defer();
    users.findOne({ email : data.info.email }, function (err, userDoc) {
        if (err) {
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }

        if (userDoc) {
            referedUserEmail.sendEmail(data, userDoc.disable_account);
            return deferred.promise;
        }

    })


}


