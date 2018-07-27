const bcrypt = require('bcryptjs');
const users = require('../../model/users');
const CandidateProfile = require('../../model/candidate_profile');
const EmployerProfile = require('../../model/employer_profile');
const Q = require('q');
const jwt = require('jsonwebtoken');
const settings = require('../../settings');

module.exports = function (req, res)
{
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
{	console.log(email);
    var deferred = Q.defer();

    users.findOne({ email: email }, function (err, user)
    {

        if (err) deferred.reject(err.name + ': ' + err.message);
        // console.log(user);

        if (user && bcrypt.compareSync(password, user.password))
        {

            console.log(user.type);
            if(user.type=='candidate')
            {
                CandidateProfile.findOne({ _creator:  user._id }, function (err, data)
                {

                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if(data)
                    {
                        deferred.resolve({
                            _id:data._id,
                            _creator: data._creator,
                            email: user.email,
                            email_hash: user.email_hash,
                            ref_link: user.ref_link,
                            is_admin:user.is_admin,
                            type:user.type,
                            is_approved : user.is_approved,
                            token: jwt.sign({ sub: user._id }, settings.EXPRESS_JWT_SECRET)
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
                //console.log("company");
                EmployerProfile.findOne({ _creator:  user._id }, function (err, data)
                {
                    //console.log(data);
                    if (err) deferred.reject(err.name + ': ' + err.message);



                    else
                    {
                        deferred.resolve({
                            _id:data._id,
                            _creator: data._creator,
                            email: user.email,
                            email_hash: user.email_hash,
                            ref_link: user.ref_link,
                            type: user.type,
                            is_admin:user.is_admin,
                            is_approved : user.is_approved,
                            token: jwt.sign({ sub: user._id }, settings.EXPRESS_JWT_SECRET)
                        });
                    }


                });
            }


        }
        else
        {
            deferred.reject("Password didn't match");
        }
    });

    return deferred.promise;
}