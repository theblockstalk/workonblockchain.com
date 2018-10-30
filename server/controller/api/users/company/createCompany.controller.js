const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const crypto = require('crypto');
const EmployerProfile = require('../../../../model/employer_profile');
const CandidateProfile  = require('../../../../model/candidate_profile');
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../services/logger');
const jwtToken = require('../../../services/jwtToken');
const filterReturnData = require('../filterReturnData');
const verify_send_email = require('../auth/verify_send_email');
const mongoose = require('mongoose');
const referral = require('../../../../model/referrals');

const referedUserEmail = require('../../../services/email/emails/referredFriend');


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
            jwt_token:jwt.sign({ sub: random }, settings.EXPRESS_JWT_SECRET),
            created_date: createdDate,
            refered_id : mongoose.Types.ObjectId(userParam.referred_id),
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

                                verifyEmail(userParam.email);
                                if(userParam.referred_id){
                                    referredFriendEmail(userParam.referred_id,  userParam.first_name , userParam.last_name);

                                }
                                insertRefCode(userData._creator.email);
                                deferred.resolve
                                ({
                                    _id:user.id,
                                    _creator: userData._creator._id,
                                    type:userData._creator.type,
                                    email: userData._creator.email,
                                    is_approved : userData._creator.is_approved,
                                    verifyEmailKey: userData._creator.verify_email_key,
                                    jwt_token: tokenn
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    function verifyEmail(email){
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
            let signOptions = {
                expiresIn:  "1h",
            };
            let verifyEmailToken = jwtToken.createJwtToken(data,signOptions);
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
    }


    return deferred.promise;
}

function referredFriendEmail(referredId,first_name,last_name){
    console.log("referred email");
    referral.findOne({  _id : referredId  }, function (err, refDoc)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});

        }
        if(refDoc)
        {
            users.findOne({  email : refDoc.email  }, function (err, userDoc)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                }
                if(userDoc && userDoc.type === 'company')
                {
                    EmployerProfile.findOne({  _creator : userDoc._id  }, function (err, employerDoc)
                    {
                        if (err){
                            logger.error(err.message, {stack: err.stack});
                        }
                        if(employerDoc)
                        {
                            let data = {fname : employerDoc.first_name , email : refDoc.email , referred_fname : first_name , referred_lname: last_name }
                            referedUserEmail.sendEmail(data, userDoc.disable_account);
                        }
                        else
                        {
                        }

                    });
                }
                if(userDoc && userDoc.type === 'candidate')
                {
                    CandidateProfile.findOne({  _creator : userDoc._id  }, function (err, candidateDoc)
                    {
                        if (err){
                            logger.error(err.message, {stack: err.stack});
                        }
                        if(candidateDoc)
                        {
                            let data = {fname : candidateDoc.first_name , email : refDoc.email , referred_fname : first_name , referred_lname: last_name }
                            referedUserEmail.sendEmail(data, userDoc.disable_account);
                        }
                        else
                        {
                        }

                    });
                }
                else
                {
                    let data = {email : refDoc.email , referred_fname : first_name , referred_lname: last_name }
                    referedUserEmail.sendEmail(data, false);

                }

            });        }
        else
        {
        }

    });

}

function insertRefCode(emailAddress){
    referral.findOne({ email: emailAddress }, function (err, refDoc)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
        }
        if (refDoc)
        {
            refToken = refDoc.url_token;
        }
        else
        {
            let new_salt = crypto.randomBytes(16).toString('base64');
            let new_hash = crypto.createHmac('sha512', new_salt);
            refToken = new_hash.digest('hex');
            refToken = refToken.substr(refToken.length - 10); //getting last 10 characters
            let newRefCode = new referral
            ({
                email: emailAddress,
                url_token: refToken,
                date_created: new Date()
            });

            newRefCode.save( (err,user) => {
                if (err) {
                    logger.error(err.message, {stack: err.stack});
                }
                else {

                }
            });
        }
    });
}

