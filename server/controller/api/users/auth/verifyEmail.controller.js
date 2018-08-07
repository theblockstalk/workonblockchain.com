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

module.exports = function (req,res)
{
    //console.log(req.params.token);
    emailVerify(req.params.email_hash).then(function (err, data)
    {
        //console.log(data);
        console.log(err);
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })


}

function emailVerify(token)
{
    var deferred = Q.defer()
    var data = jwt_hash.decode(token, settings.EXPRESS_JWT_SECRET, 'HS256');
    if(new Date(data.expiry) > new Date())
    {
        users.findOne(  { email_hash:token  }, function (err, result)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if(result)
            {
                updateData(result._id);
            }
            else
                deferred.reject("Result not found");
        });

        function updateData(_id)
        {
            var set =
                {
                    is_verify: 1,
                };
            users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                    deferred.resolve({msg:'Email Verified'});
            });
        }
    }

    else
    {
        deferred.resolve({msg:'Link Expired'});
        //deferred.reject('Link expired');
    }
    return deferred.promise;

}