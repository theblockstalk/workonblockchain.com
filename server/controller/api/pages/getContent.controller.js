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

module.exports = function (req,res)
{
    get_content(req.params.title).then(function (err, data)
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

function get_content(name)
{
    var deferred = Q.defer();
    if(name === 'Privacy Notice' || name === 'Terms and Condition for candidate' || name === 'Terms and Condition for company'){
        Pages.findOne({page_name: name}).sort({updated_date: 'descending'}).exec(function (err, result) {
            if (err) {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                ////console.log(user);
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }
    else {
        Pages.find({page_name: name}).exec(function (err, result) {

            if (err) {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                ////console.log(user);
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }
}