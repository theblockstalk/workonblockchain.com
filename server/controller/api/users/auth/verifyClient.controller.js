const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const Pages = require('../../../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../../model/employer_profile');
var md5 = require('md5');
const chat = require('../../../../model/chat');

const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const referUserEmail = require('../../../services/email/emails/referUser');
const chatReminderEmail = require('../../../services/email/emails/chatReminder');
const referedUserEmail = require('../../../services/email/emails/referredFriend');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../services/logger');

const verify_send_email = require('./verify_send_email');

module.exports = function verify_client(req,res)
{
    console.log(req.params.email);
    verify_client(req.params.email).then(function (err, data)
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

}

function verify_client(email)
{
    var deferred = Q.defer();
    console.log(email);
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
            deferred.resolve({error:'Email Not Found'});
        }

    });

    function updateData(data)
    {
    	console.log(email)
        var hashStr = crypto.createHash('md5').update(email).digest('hex');
        // console.log(hashStr);
        // console.log(data._id);

        var user_info = {};
        user_info.hash = hashStr;
        user_info.email = email;
        //user_info.name = userParam.first_name;
        user_info.expiry = new Date(new Date().getTime() +  1800 *1000);
        var token = jwt_hash.encode(user_info, settings.EXPRESS_JWT_SECRET, 'HS256');
        user_info.token = token;
        var set =
            {
        		verify_email_key: token,

            };
        users.update({ _id: mongo.helper.toObjectID(data._id) },{ $set: set }, function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
            {
                verify_send_email(user_info);
                deferred.resolve({msg:'Email Send'});
            }
        });
    }


    return deferred.promise;

}