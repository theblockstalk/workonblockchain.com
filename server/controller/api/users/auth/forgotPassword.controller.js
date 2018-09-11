const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const logger = require('../../../services/logger');

module.exports = function (req,res)
{
    ////console.log(req.params.email);
    forgot_password(req.params.email).then(function (err, data)
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

function forgot_password(email)
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
            deferred.resolve({error:'Email Not Found'});
        }

    });

    function updateData(data)
    {
		var hashStr = crypto.createHash('sha256').update(email).digest('base64');
        // //console.log(hashStr);
        // //console.log(data._id);
        var email_data = {};
        email_data.password_key = hashStr;
        email_data.email = data.email;
        email_data.name = data.first_name;
        email_data.expiry = new Date(new Date().getTime() +  1800 *1000);
        var token = jwt_hash.encode(email_data, settings.EXPRESS_JWT_SECRET, 'HS256');
        email_data.token = token;
        var set =
            {
        		forgot_password_key: token,

            };
        users.update({ _id: mongo.helper.toObjectID(data._id) },{ $set: set }, function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
            {
                forgot_passwordEmail_send(email_data.token)
                deferred.resolve({msg:'Email Send'});
            }
        });
    }


    return deferred.promise;

}

function forgot_passwordEmail_send(data)
{

    var hash = jwt_hash.decode(data, settings.EXPRESS_JWT_SECRET, 'HS256');
    ////console.log(hash.email);
    var name;

    users.findOne({ email :hash.email  }, function (err, result)
    {
        if (err)
        {
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }

        if(result)
        {
            CandidateProfile.find({_creator : result._id}).populate('_creator').exec(function(err, query_data)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                if(query_data)
                {
                    ////console.log(query_data);
                    name = query_data[0].first_name;
                    //console.log(name);
                    forgotPasswordEmail.sendEmail(hash,data , name);
                }
            });

        }
        else
        {
            deferred.resolve({error:'Email Not Found'});
        }

    });

}