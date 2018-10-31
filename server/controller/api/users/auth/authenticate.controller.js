const bcrypt = require('bcryptjs');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const Q = require('q');
const jwtToken = require('../../../services/jwtToken');
const crypto = require('crypto');
const logger = require('../../../services/logger');
const referral = require('../../../../model/referrals');

module.exports = function (req, res) {
    authenticate(req.body.email, req.body.password).then(function (user)
    {
        if (user)
        {
            // authentication successful
            res.json(user);
        }
        else
        {
            // authentication failed
            res.json({msg: 'Username or password is incorrect'});
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function authenticate(email, password,type)
{
    var deferred = Q.defer();

    users.findOne({ email: email }, function (err, user)
    {

        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user)
        {
            let hash = crypto.createHmac('sha512', user.salt);
            hash.update(password);
            let hashedPasswordAndSalt = hash.digest('hex');

            if (hashedPasswordAndSalt === user.password_hash)
            {
                if(user.type=='candidate')
                {
                    CandidateProfile.findOne({ _creator:  user._id }, function (err, data)
                    {

                        if (err) deferred.reject(err.name + ': ' + err.message);

                        if(data)
                        {
                            let token = jwtToken.createJwtToken(user);
                            logger.debug(logger);

                            var set =
                                {
                                    jwt_token: token,

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
                                    deferred.resolve({
                                        _id:data._id,
                                        _creator: data._creator,
                                        email: user.email,
                                        email_hash: user.email_hash,
                                        is_admin:user.is_admin,
                                        type:user.type,
                                        is_approved : user.is_approved,
                                        jwt_token: token
                                    });

                                }

                            });


                        }

                        else
                        {
                            deferred.reject("Email Not found");
                        }


                    });
                }
                if(user.type=='company')
                {
                    EmployerProfile.findOne({ _creator:  user._id }, function (err, data)
                    {
                        if (err) deferred.reject(err.name + ': ' + err.message);

                        if(data)
                        {
                            let token = jwtToken.createJwtToken(user);
                            logger.debug(logger);

                            var set =
                                {
                                    jwt_token: token,

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

                                    deferred.resolve({
                                        _id:data._id,
                                        _creator: data._creator,
                                        email: user.email,
                                        email_hash: user.email_hash,
                                        is_admin:user.is_admin,
                                        type:user.type,
                                        is_approved : user.is_approved,
                                        jwt_token: token
                                    });

                                }

                            });

                        }

                        else
                        {
                            deferred.reject("Email Not found");
                        }

                    });
                }
            }
            else
            {
                deferred.reject("Incorrect Password");
            }

        }
        else
        {
            deferred.reject("Incorrect Username or Password");
        }
    });

    return deferred.promise;
}