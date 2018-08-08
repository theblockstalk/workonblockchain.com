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

module.exports = function insert_message_job(req,res){
    insert_message_job(req.body).then(function (err, about)
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

function insert_message_job(data){
    var current_date = new Date();
    var day = current_date.getDate();
    if(day < 10){
        day = '0'+day;
    }
    var month = current_date.getMonth();
    month = month+1;
    if(month < 10){
        month = '0'+month;
    }
    var year = current_date.getFullYear();
    var hours = current_date.getHours();
    if(hours < 10){
        hours = '0'+hours;
    }
    var minutes = current_date.getMinutes();
    if(minutes < 10){
        minutes = '0'+minutes;
    }
    var seconds = current_date.getSeconds();
    if(seconds < 10){
        seconds = '0'+seconds;
    }
    var my_date = day+'/'+month+'/'+year+' '+hours+':'+minutes+':'+seconds;
    var deferred = Q.defer();
    let newChat = new chat({
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        sender_name: data.sender_name,
        receiver_name: data.receiver_name,
        message: data.message,
        job_title: data.job_title,
        salary: data.salary,
        date_of_joining: data.date_of_joining,
        msg_tag: data.msg_tag,
        is_company_reply: data.is_company_reply,
        job_type: data.job_type,
        file_name: data.file_name,
        is_job_offered: data.job_offered,
        is_read: 0,
        date_created: my_date
    });

    newChat.save((err,data)=>
    {
        if(err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            //console.log('done');
            deferred.resolve({Success:'Msg sent'});
}
});
    return deferred.promise;
}