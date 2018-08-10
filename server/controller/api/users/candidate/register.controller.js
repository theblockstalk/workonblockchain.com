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
var md5 = require('md5');
const verify_send_email = require('../auth/verify_send_email');
const mongoose = require('mongoose');

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
        var is_verify;
        if(userParam.social_type!="")
        {
            is_verify =1;
        }

        let now = new Date();
		let salt = crypto.randomBytes(16).toString('base64');
		let random = crypto.randomBytes(16).toString('base64');
		//console.log(salt);
		let hash = crypto.createHmac('sha512', salt);
		hash.update(userParam.password);
		let hashedPasswordAndSalt = hash.digest('hex');
		//console.log(hashedPasswordAndSalt);
        createdDate= date.format(now, 'DD/MM/YYYY');
        var hashStr = crypto.createHash('md5').update(userParam.email).digest('hex');
        var user_info = {};
        user_info.hash = hashStr;
        user_info.email = userParam.email;
        user_info.name = userParam.first_name;
        user_info.expiry = new Date(new Date().getTime() +  1800 *1000);
        var token = jwt_hash.encode(user_info, settings.EXPRESS_JWT_SECRET, 'HS256');
        user_info.token = token;

        email = userParam.email;
        email = email.split("@");
        email = md5(email[0]);
        email = md5(email);
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
            jwt_token:jwt.sign({ sub: random }, settings.EXPRESS_JWT_SECRET),
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
                    let info = new CandidateProfile
                    ({
                        _creator : newUser._id
                    });

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
                    			_creator: newUser._id,
                    			email_hash:newUser.email_hash,
                    			type:newUser.type,
                    			email: newUser.email,
                    			ref_link: newUser.ref_link,
                    			type: newUser.type,
                    			is_approved : user.is_approved,
                    			token: newUser.jwt_token
                    		});
                    	}
                    });
                }
        });
    }

    return deferred.promise;
}
