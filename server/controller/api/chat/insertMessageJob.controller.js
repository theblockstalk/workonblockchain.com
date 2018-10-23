const settings = require('../../../settings');
var _ = require('lodash');
var date = require('date-and-time');
var Q = require('q');
const chat = require('../../../model/chat');
const mongoose = require('mongoose');
const sanitize = require('../../services/sanitize');

const logger = require('../../services/logger');

module.exports = function insert_message_job(req,res){
	let sanitizeddescription = sanitize.sanitizeHtml(req.body.description);
    let sanitizedmessage = sanitize.sanitizeHtml(req.body.message);
	let path = '';
	if(req.body.file_to_send == 1){
		if (settings.isLiveApplication()) {
			path = req.file.location; // for S3 bucket
		} else {
			path = settings.FILE_URL+req.file.filename;
		}
	}
	let userId = req.auth.user._id;
	
	insert_message_job_new(req.body,sanitizeddescription,sanitizedmessage,userId,path).then(function (err, about)
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

function insert_message_job_new(data,description,msg,senderId,fileName){
	let new_description = '';
	let new_msg = '';
    if(description){
        new_description = description.replace(/\r\n|\n\r/g, '\n').replace(/\n\n/g, '\n').replace(/\n/g, '<br />');
        //new_description = description.replace(/\n/g, "<br>");
        new_description = new_description.replace(/<(?!br\s*\/?)[^>]+>/g, '');
        //new_description = new_description.replace(/<br[^>]*>/, '');
    }
    if(msg){
        new_msg = msg.replace(/\r\n|\n\r/g, '\n').replace(/\n\n/g, '\n').replace(/\n/g, '<br />');
        //new_msg = msg.replace(/\n/g, "<br>");
        new_msg = new_msg.replace(/<(?!br\s*\/?)[^>]+>/g, '');
        //new_msg = new_msg.replace(/<br[^>]*>/, '');
    }
	var current_date = new Date();
	my_date = date.format(current_date, 'MM/DD/YYYY HH:mm:ss');
    var deferred = Q.defer();
	if(data.employment_reference_id == 0){
		let newChat = new chat({
			sender_id : mongoose.Types.ObjectId(senderId),
			receiver_id : mongoose.Types.ObjectId(data.receiver_id),
			sender_name: data.sender_name,
			receiver_name: data.receiver_name,
			message: new_msg,
			description: new_description,
			job_title: data.job_title,
			salary: data.salary,
			salary_currency: data.currency,
			date_of_joining: data.date_of_joining,
			msg_tag: data.msg_tag,
			is_company_reply: data.is_company_reply,
			job_type: data.job_type,
			file_name: fileName,
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
				////console.log('done');
				deferred.resolve({Success:'Msg sent'});
			}
		});
		return deferred.promise;
	}
	else{
		let newChat = new chat({
			sender_id : mongoose.Types.ObjectId(senderId),
			receiver_id : mongoose.Types.ObjectId(data.receiver_id),
			sender_name: data.sender_name,
			receiver_name: data.receiver_name,
			message: new_msg,
			description: new_description,
			job_title: data.job_title,
			salary: data.salary,
			salary_currency: data.currency,
			date_of_joining: data.date_of_joining,
			msg_tag: data.msg_tag,
			is_company_reply: data.is_company_reply,
			job_type: data.job_type,
			file_name: fileName,
			is_job_offered: data.job_offered,
			is_read: 0,
			employment_offer_reference: mongoose.Types.ObjectId(data.employment_reference_id),
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
}