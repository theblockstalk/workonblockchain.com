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
var md5 = require('md5');
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
    get_unread_msgs().then(function (err, about)
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

function get_unread_msgs(){
    var deferred = Q.defer();
    //console.log('get all unread msgs');
    //chat.aggregate({$group : {"receiver_id" : "$by_user", num_tutorial : {$sum : 1}}}, function (err, result){
    chat.distinct("receiver_id", {is_read: 0}, function (err, result){
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            for(var i=0;i<result.length;i++){
                //console.log(result[i]);
                users.findOne({ _id: result[i],is_unread_msgs_to_send: true},{"email":1,"type":1}, function (err, newResult){
                    if(newResult){
                        if(newResult.type == 'candidate'){
                            CandidateProfile.find({ _creator: newResult._id},{"first_name":1}, function (err, query_data){
                                if (err){
                                    logger.error(err.message, {stack: err.stack});
                                    deferred.reject(err.name + ': ' + err.message);
                                }
                                if(query_data){
                                    chatReminderEmail.sendEmail(newResult.email,query_data[0].first_name);
                                }
                            });
                        }
                        else{
                            EmployerProfile.find({ _creator: newResult._id},{"first_name":1}, function (err, query_data){
                                if (err){
                                    logger.error(err.message, {stack: err.stack});
                                    deferred.reject(err.name + ': ' + err.message);
                                }
                                if(query_data){
                                    chatReminderEmail.sendEmail(newResult.email,query_data[0].first_name);
                                }
                            });
                        }
                    }
                });
            }
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}