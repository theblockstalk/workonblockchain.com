const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const jwtToken = require('../../../services/jwtToken');

const logger = require('../../../services/logger');

const verify_send_email = require('./verify_send_email');

module.exports = function verify_client(req,res)
{
    verify_client_email(req.params.email).then(function (err, data)
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

function verify_client_email(email)
{
    var deferred = Q.defer();

    users.findOne({ email :email  }, function (err, result)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(result)
        {
            updateData(result);
        }
        else
        {
            deferred.resolve({success : false , error:'Email Not Found'});
        }

    });

    function updateData(data)
    {
		/*var hashStr = crypto.createHash('sha256').update(email).digest('base64');

        var user_info = {};
        user_info.hash = hashStr;
        user_info.email = email;
        user_info.expiry = new Date(new Date().getTime() +  4800 *1000);
        var token = jwt_hash.encode(user_info, settings.EXPRESS_JWT_SECRET, 'HS256');
        user_info.token = token;*/
        let verifyEmailToken = jwtToken.createJwtToken(data);
        var set =
            {
        		verify_email_key: verifyEmailToken,

            };
        users.update({ _id: mongo.helper.toObjectID(data._id) },{ $set: set }, function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
            {
                verify_send_email(data.email , verifyEmailToken);
                deferred.resolve({success : true , msg:'Email Send'});
            }
        });
    }


    return deferred.promise;

}