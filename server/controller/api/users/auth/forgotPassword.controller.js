const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const logger = require('../../../services/logger');
const EmployerProfile = require('../../../../model/employer_profile');
const jwtToken = require('../../../services/jwtToken');

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
        let signOptions = {
            expiresIn:  "1h",
        };
        let forgotPasswordToken = jwtToken.createJwtToken(data,signOptions);
        var set =
        {
        		forgot_password_key: forgotPasswordToken,

        };
        users.update({ _id: mongo.helper.toObjectID(data._id) },{ $set: set }, function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
            {
            	console.log(data.email);
                forgot_passwordEmail_send(data.email , forgotPasswordToken)
                deferred.resolve({
                    success: true,
                    msg:'Email Sent'
                });
            }
        });
    }


    return deferred.promise;

}

function forgot_passwordEmail_send(emailAddress , token)
{
    var deferred = Q.defer();

    users.findOne({ email : emailAddress  }, function (err, userDoc)
    {
        if (err)
        {
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }

        if(userDoc)
        {
        	if(userDoc.type === 'candidate')
        	{
        		CandidateProfile.find({_creator : userDoc._id}).populate('_creator').exec(function(err, query_data)
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
        	                    
        	                    
        	                    forgotPasswordEmail.sendEmail(emailAddress,name,token);
        	                }
        	            });
        	}
        	
        	if(userDoc.type === 'company')
        	{
        		EmployerProfile.find({_creator : userDoc._id}).populate('_creator').exec(function(err, query_data)
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
        	                    
        	                    
        	                    forgotPasswordEmail.sendEmail(emailAddress,name,token);
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