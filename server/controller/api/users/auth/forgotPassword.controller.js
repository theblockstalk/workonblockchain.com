const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const logger = require('../../../services/logger');
const EmployerProfile = require('../../../../model/employer_profile');

module.exports = function (req,res)
{

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
        	if(result.social_type === 'GOOGLE')
        	{
        		deferred.resolve({error:'Please login using gmail'});
        	}
        	
        	if(result.social_type === 'LINKEDIN')
        	{
        		deferred.resolve({error:'Please login using linkedin'});
        	}
        	
        	if(!result.social_type)
        	{
        		updateData(result);
        	}
      
        }
        else
        {
            deferred.resolve({success: false, error:'Email Not Found'});
        }

    });

    function updateData(data)
    {
		var hashStr = crypto.createHash('sha256').update(email).digest('base64');

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
                deferred.resolve({
                    success: true,
                    msg:'Email Sent'
                });
            }
        });
    }


    return deferred.promise;

}

function forgot_passwordEmail_send(data)
{
    var deferred = Q.defer();
    var hash = jwt_hash.decode(data, settings.EXPRESS_JWT_SECRET, 'HS256');

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
        	if(result.type === 'candidate')
        	{
        		CandidateProfile.find({_creator : result._id}).populate('_creator').exec(function(err, query_data)
        	            {
        	                if (err){
        	                    logger.error(err.message, {stack: err.stack});
        	                    deferred.reject(err.name + ': ' + err.message);
        	                }
        	                if(query_data)
        	                {
                                if(query_data[0] && query_data[0].first_name)
                                {

                                        name = query_data[0].first_name;

                                }

        	                	else
        	                	{
        	                		name = null;
        	                	}
        	                    
        	                    
        	                    forgotPasswordEmail.sendEmail(hash,data , name);
        	                }
        	            });
        	}
        	
        	if(result.type === 'company')
        	{
        		EmployerProfile.find({_creator : result._id}).populate('_creator').exec(function(err, query_data)
        	            {
        	                if (err){
        	                    logger.error(err.message, {stack: err.stack});
        	                    deferred.reject(err.name + ': ' + err.message);
        	                }
        	                if(query_data)
        	                {

                                if(query_data[0] && query_data[0].first_name)
                                {
                                        name = query_data[0].first_name;

                                }

                                else
                                {
                                    name = null;
                                }
        	                    
        	                    
        	                    forgotPasswordEmail.sendEmail(hash,data , name);
        	                }
        	            });
        	}
            
        }
        else
        {
            deferred.resolve({success: false, error:'Email Not Found'});
        }

    });

}