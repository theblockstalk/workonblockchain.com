const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const verify_send_email = require('../auth/verify_send_email');
const mongoose = require('mongoose');
const jwtToken = require('../../../services/jwtToken');
const filterReturnData = require('../filterReturnData');

const logger = require('../../../services/logger');

///////to create new candidate////////////////////////////

module.exports = function register(req, res)
    {
        create(req.body).then(function (data)
        {
            res.json(data);
        })
            .catch(function (err)
            {
                res.json({error: err});
            });
    };

function create(userParam)
{
	//console.log(userParam);
    var deferred = Q.defer();
    var count=0;

    var createdDate;
    users.findOne({ email: userParam.email }, function (err, user)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if (user)
        {
            deferred.reject('Email "' + userParam.email + '" is already taken');
        }
        else
        {
            createUser();
        }
    });

    function createUser()
    {
        let is_verify=0;
        if(userParam.social_type!="")
        {
            is_verify =1;
        }

        let now = new Date();
		let salt = crypto.randomBytes(16).toString('base64');
		let hash = crypto.createHmac('sha512', salt);
		hash.update(userParam.password);
		let hashedPasswordAndSalt = hash.digest('hex');

        createdDate= now;
        var hashStr = crypto.createHash('sha256').update(userParam.email).digest('base64');
        var user_info = {};
        user_info.hash = hashStr;
        user_info.email = userParam.email;
        user_info.name = userParam.first_name;
        user_info.expiry = new Date(new Date().getTime() +  4800 *1000);
        var token = jwt_hash.encode(user_info, settings.EXPRESS_JWT_SECRET, 'HS256');
        user_info.token = token;
        //let verifyEmailKey = jwtToken.createJwtToken(user_info);

		let new_salt = crypto.randomBytes(16).toString('base64');
		let new_hash = crypto.createHmac('sha512', new_salt);
		let email = new_hash.digest('hex');
		let refered_id= 0;
        let newUser = new users
        ({
            email: userParam.email,
            password_hash: hashedPasswordAndSalt,
			salt : salt,
            type: userParam.type,
            ref_link: email,
            social_type: userParam.social_type,
            verify_email_key: token,
            is_verify:is_verify,
            created_date: createdDate,
            refered_id : mongoose.Types.ObjectId(userParam.refer_by),
        });

        newUser.save( (err,user) =>
        {
            if(err)
            {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                {

            	let tokenn = jwtToken.createJwtToken(user);

                var set =
                {
                	    jwt_token: tokenn,

                };
                users.update({ _id: user._id},{ $set: set }, function (err, doc)
                {
                	if (err)
                	{
                		logger.error(err.message, {stack: err.stack});
                		deferred.reject(err.name + ': ' + err.message);
                	}
                	else
                	{
                		let info = new CandidateProfile
                        ({
                            _creator : newUser._id
                        });
                        let userData = filterReturnData.removeSensativeData({_creator : user.toObject()} , {
                            verify_email_key: true
                        } )
                        info.save((err,user)=>
                        {
                        	if(err)
                        	{
                        		logger.error(err.message, {stack: err.stack});
                        		deferred.reject(err.name + ': ' + err.message);
                        	}
                        	else
                        	{
                        		if(newUser.social_type == "")
                        		{
                        			verify_send_email(user_info);
                        		}

                        		deferred.resolve
                        		({
                                    _id:user.id,
                                    _creator: userData._creator._id,
                                    email_hash:userData._creator.verify_email_key,
                                    type:userData._creator.type,
                                    email: userData._creator.email,
                                    ref_link: userData._creator.ref_link,
                                    type: userData._creator.type,
                                    is_approved : userData._creator.is_approved,
                                    jwt_token: tokenn
                        		});
                        	}
                        });
                	}
                		
                });
                    
                }
        });
    }

    return deferred.promise;
}
