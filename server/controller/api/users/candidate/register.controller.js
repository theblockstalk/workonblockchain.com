const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
var md5 = require('md5');
const verify_send_email = require('../auth/verify_send_email');

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
        var is_verify;
        if(userParam.social_type!="")
        {
            is_verify =1;
        }

        let now = new Date();
        createdDate= date.format(now, 'DD/MM/YYYY');
        var hashStr = crypto.createHash('md5').update(userParam.email).digest('hex');
        var user_info = {};
        user_info.hash = hashStr;
        user_info.email = userParam.email;
        user_info.name = userParam.first_name;
        user_info.expiry = new Date(new Date().getTime() +  1800 *1000);
        var token = jwt_hash.encode(user_info, settings.EXPRESS_JWT_SECRET, 'HS256');
        user_info.token = token;
        //console.log(user_info);
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        var salt = bcrypt.genSaltSync(10);
        // add hashed password to user object
        user.password = bcrypt.hashSync(userParam.password, salt);
        email = userParam.email;
        email = email.split("@");
        email = md5(email[0]);
        email = md5(email);
        let newUser = new users
        ({
            email: userParam.email,
            password: user.password,
            type: userParam.type,
            ref_link: email,
            social_type: userParam.social_type,
            email_hash: token,
            is_verify:is_verify,
            created_date: createdDate,
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
            token: jwt.sign({ sub: user._id }, settings.EXPRESS_JWT_SECRET)
        });
    }
    });
    }
    });
    }

    return deferred.promise;
}
