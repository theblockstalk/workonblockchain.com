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
    referedUserEmail.sendEmail(data);
    return deferred.promise;

}


