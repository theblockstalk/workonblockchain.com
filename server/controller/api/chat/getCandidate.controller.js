const settings = require('../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const Pages = require('../../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../model/employer_profile');
var md5 = require('md5');
const chat = require('../../../model/chat');

const forgotPasswordEmail = require('../../services/email/emails/forgotPassword');
const verifyEmailEmail = require('../../services/email/emails/verifyEmail');
const referUserEmail = require('../../services/email/emails/referUser');
const chatReminderEmail = require('../../services/email/emails/chatReminder');
const referedUserEmail = require('../../services/email/emails/referredFriend');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../services/logger');

module.exports = function (req, res)
{
    get_candidate(req.body.type).then(function (user)
    {
        if (user)
        {
            res.send(user);
        }
        else
        {
            res.sendStatus(404);
        }
    })
        .catch(function (err)
        {
            res.status(400).send(err);
        });
}

function get_candidate(user_type)
{
    /*var deferred = Q.defer();

    users.find({ type: user_type }, function (err, user)
    {
       // console.log(bcrypt.compareSync(password, user.password));
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user){
            deferred.resolve({
                users:user
            });
        }
        else
        {
            deferred.reject("Password didn't match");
            //deferred.resolve();
        }
    });

    return deferred.promise;*/
    //console.log(user_type);
    var deferred = Q.defer();
    users.find({type : user_type}, function (err, data)
    {

        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if(data)
        {
            var array = [];
            data.forEach(function(item)
            {
                array.push(item._id);
            });

            if(user_type == 'candidate'){
                CandidateProfile.find({ "_creator": {$in: array}}).populate('_creator').exec(function(err, result)
                {
                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                    }
                    if (result)
                    {
                        deferred.resolve({
                            users:result
                        });
                    }
                    else
                    {
                        deferred.reject("Not Found");
                    }
                });
            }
            else{
                EmployerProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
                {
                    if (err){
                        //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                        logger.error(err.message, {stack: err.stack});
                    }
                    if (result)
                    {
                        deferred.resolve({
                            users:result
                        });
                    }
                    else
                    {
                        deferred.reject("Not Found");
                    }
                });
            }

        }

        else
        {
            deferred.reject("Not Found");
        }

    });

    return deferred.promise;
}