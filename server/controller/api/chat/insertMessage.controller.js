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
const mongoose = require('mongoose');

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

//////////inserting message in DB ////////////

module.exports = function insert_message(req, res)
{
    insert_message_new(req.body).then(function (data)
    {
        if (data)
        {
            //console.log(data);
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

function insert_message_new(data){
	console.log(data.msg_tag);
	interview_date = '';
	if(data.msg_tag == 'interview_offer'){
		interview_date = data.date_of_joining+' '+data.interview_time+':00';
	}
	var current_date = new Date();
	my_date = date.format(current_date, 'MM/DD/YYYY HH:mm:ss');
    var deferred = Q.defer();
    let newChat = new chat({
        sender_id : mongoose.Types.ObjectId(data.sender_id),
		receiver_id : mongoose.Types.ObjectId(data.receiver_id),
        sender_name: data.sender_name,
        receiver_name: data.receiver_name,
        message: data.message,
		description: data.description,
        job_title: data.job_title,
        salary: data.salary,
		salary_currency: data.currency,
        date_of_joining: '',
        msg_tag: data.msg_tag,
        is_company_reply: data.is_company_reply,
        job_type: data.job_type,
        is_read: 0,
		interview_location: data.interview_location,
		interview_date_time: interview_date,
        date_created: my_date
    });

    newChat.save((err,data)=>
    {
        if(err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            ////console.log('done');
            deferred.resolve({Success:'Msg sent'});
}
});
    return deferred.promise;
}