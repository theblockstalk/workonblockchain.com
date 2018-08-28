const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
const users = require('../../../../model/users');
const crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../../model/employer_profile');
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../services/logger');
const verify_send_email = require('../auth/verify_send_email');
const jwtToken = require('../../../services/jwtToken');

module.exports = function (req,res)
{

    create_employer(req.body).then(function (err, data)
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

};

function create_employer(userParam)
{
    var deferred = Q.defer();
    var count=0;
    var createdDate;

    var str = userParam.email;
    var email_split = str.split('@');

    for (var i = 0; i < emails.length; i++)
    {
        if(emails[i] == email_split[1])
        {
            count++;
        }

    }
    if(count == 1)
    {
        deferred.reject('Please enter your company email');
    }
    else
    {
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
                createEmployer();
            }
        });
    }

    function createEmployer()
    {
        let now = new Date();
        createdDate= now;
        var hashStr = crypto.createHash('sha256').update(userParam.email).digest('base64');
        var company_info = {};
        company_info.hash = hashStr;
        company_info.email = userParam.email;
        company_info.name = userParam.first_name;
        company_info.expiry = new Date(new Date().getTime() +  1800 *1000);
        var token = jwt_hash.encode(company_info, settings.EXPRESS_JWT_SECRET, 'HS256');
        company_info.token = token;
       
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt);
		hash.update(userParam.password);
		let hashedPasswordAndSalt = hash.digest('hex');
		
		 let random = crypto.randomBytes(16).toString('base64');
        let newUser = new users
        ({
            email: userParam.email,
            password_hash: hashedPasswordAndSalt,
            salt : salt,
            type: userParam.type,
            verify_email_key: token,
            jwt_token:jwt.sign({ sub: random }, settings.EXPRESS_JWT_SECRET),
            created_date: createdDate,

        });

        newUser.save((err,user)=>
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
                		let info = new EmployerProfile
                		({
                			_creator : newUser._id,
                			first_name : userParam.first_name,
                			last_name: userParam.last_name,
                			job_title:userParam.job_title,
                			company_name: userParam.company_name,
                			company_website:userParam.company_website,
                			company_phone:userParam.phone_number,
                			company_country:userParam.country,
                			company_city:userParam.city,
                			company_postcode:userParam.postal_code,
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
                				verify_send_email(company_info);
                				deferred.resolve
                				({
                					_id:user.id,
                					_creator: newUser._id,
                					type:newUser.type,
                					email_hash:newUser.email_hash,
                					email: newUser.email,
                					is_approved : user.is_approved,
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