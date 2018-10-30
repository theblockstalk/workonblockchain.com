const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwtToken = require('../../../services/jwtToken');
const filterReturnData = require('../filterReturnData');
const referral = require('../../../../model/referrals');

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
        let email;
        if(userParam.social_type!="")
        {
            is_verify =1;
        }

        referral.findOne({ email: userParam.email }, function (err, user)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if (user)
            {
                email = user.url_token;
            }
            else
            {
                let new_salt = crypto.randomBytes(16).toString('base64');
                let new_hash = crypto.createHmac('sha512', new_salt);
                email = new_hash.digest('hex');
                email = email.substr(email.length - 10); //getting last 10 characters
                let newRefCode = new referral
                ({
                    email: userParam.email,
                    url_token: email,
                    date_created: new Date()
                });

                newRefCode.save( (err,user) => {
                    if (err) {
                        logger.error(err.message, {stack: err.stack});
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    else {

                    }
                });
            }
        });
        let now = new Date();
		let salt = crypto.randomBytes(16).toString('base64');
		let hash = crypto.createHmac('sha512', salt);
		hash.update(userParam.password);
		let hashedPasswordAndSalt = hash.digest('hex');

        createdDate= now;

        let newUser = new users
        ({
            email: userParam.email,
            password_hash: hashedPasswordAndSalt,
			salt : salt,
            type: userParam.type,
            social_type: userParam.social_type,
            is_verify:is_verify,
            created_date: createdDate,
            refered_id : mongoose.Types.ObjectId(userParam.referred_id),
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
                        let userData = filterReturnData.removeSensativeData({_creator : user.toObject()})
                        info.save((err,user)=>
                        {
                        	if(err)
                        	{
                        		logger.error(err.message, {stack: err.stack});
                        		deferred.reject(err.name + ': ' + err.message);
                        	}
                        	else
                        	{

                        		deferred.resolve
                        		({
                                    _id:user.id,
                                    _creator: userData._creator._id,
                                    type:userData._creator.type,
                                    email: userData._creator.email,
                                    ref_link: email,
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
