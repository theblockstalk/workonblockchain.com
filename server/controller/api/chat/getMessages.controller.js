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

module.exports = function (req, res)
{
    get_messages(req.body.receiver_id,req.body.sender_id).then(function (data)
    {
        if (data)
        {
            res.send(data);
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

function get_messages(receiver_id,sender_id){
    //console.log(receiver_id)
    var deferred = Q.defer();
    /*$or : [
        { $and : [ { receiver_id : {$regex: receiver_id} }, { sender_id : {$regex: sender_id} } ] },
        { $and : [ { receiver_id : {$regex: sender_id} } }, { sender_id : {$regex: receiver_id} } ] }
    ]*/
    chat.find({
        $or : [
            { $and : [ { receiver_id : receiver_id }, { sender_id : sender_id } ] },
            { $and : [ { receiver_id : sender_id }, { sender_id : receiver_id } ] }
        ]
    }).sort({_id: 'ascending'}).exec(function(err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            //console.log(data);
            deferred.resolve({
                datas:data
            });
        }
    });
    return deferred.promise;
}