const bcrypt = require('bcryptjs');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const Q = require('q');
const jwtToken = require('../../../services/jwtToken');

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
                        let token = jwtToken.createJwtToken(user);
                        deferred.resolve({
                            _id:data._id,
                            _creator: data._creator,
                            email: user.email,
                            email_hash: user.email_hash,
                            ref_link: user.ref_link,
                            is_admin:user.is_admin,
                            type:user.type,
                            is_approved : user.is_approved,
                            token: token
                        });
                        /*
                        TODO: need to send the token to the client in the response header (I think).
                        The client needs to store the token as a cookie or in browser storage and use it again for next endpoint call

                        This is my rough estimate
                        res.header.someFieldToBeStoredInClientCookies = token

                         */
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
                        let token = jwtToken.createJwtToken(user);
                        deferred.resolve({
                            _id:data._id,
                            _creator: data._creator,
                            email: user.email,
                            email_hash: user.email_hash,
                            ref_link: user.ref_link,
                            type: user.type,
                            is_admin:user.is_admin,
                            is_approved : user.is_approved,
							token: token
                        });

                        /*
                        TODO: need to send the token to the client in the response header (I think).
                        The client needs to store the token as a cookie or in browser storage and use it again for next endpoint call

                        This is my rough estimate
                        res.header.someFieldToBeStoredInClientCookies = token

                         */
                    }


                });
            }


        }
        else
        {
            deferred.reject("Incorrect Username or Password");
        }
    });

    return deferred.promise;
}