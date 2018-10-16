const settings = require('../../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const Pages = require('../../../../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../../../model/employer_profile');
const chat = require('../../../../../model/chat');

const forgotPasswordEmail = require('../../../../services/email/emails/forgotPassword');
const verifyEmailEmail = require('../../../../services/email/emails/verifyEmail');
const referUserEmail = require('../../../../services/email/emails/referUser');
const chatReminderEmail = require('../../../../services/email/emails/chatReminder');
const referedUserEmail = require('../../../../services/email/emails/referredFriend');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../../services/logger');

module.exports = function (req,res){
	let userId = req.auth.user._id;
    set_unread_msgs_emails_status(req.body,userId).then(function (err, about)
    {
        if (about)
        {
            res.json(about);
        }
        else
        {
            res.json(err);
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function set_unread_msgs_emails_status(data,userId){
    var deferred = Q.defer();
    ////console.log(data.user_id);
    var set =
        {
            is_unread_msgs_to_send: data.status,

        };
    users.update({ _id: userId},{ $set: set }, function (err, doc)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            deferred.resolve(set);
    });
    return deferred.promise;
}