const settings = require('../../../settings');
var _ = require('lodash');
var date = require('date-and-time');
var Q = require('q');
const chat = require('../../../model/chat');
const mongoose = require('mongoose');

const logger = require('../../services/logger');

module.exports = function (req,res){
	let path = '';
	if(req.file){
		if (settings.isLiveApplication()) {
			path = req.file.location; // for S3 bucket
		} else {
			path = settings.FILE_URL+req.file.filename;
		}
	}
	let userId = req.auth.user._id;
    save_chat_file(req.body,userId,path).then(function (err, about)
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

function save_chat_file(data,senderId,fileName){
	console.log(data.is_company_reply);
    var current_date = new Date();
	my_date = date.format(current_date, 'MM/DD/YYYY HH:mm:ss');
    var deferred = Q.defer();
    let newChat = new chat({
		sender_id : mongoose.Types.ObjectId(senderId),
		receiver_id : mongoose.Types.ObjectId(data.receiver_id),
        sender_name: data.sender_name,
        receiver_name: data.receiver_name,
        message: data.message,
        job_title: data.job_title,
        salary: data.salary,
        date_of_joining: data.date_of_joining,
        msg_tag: data.msg_tag,
        is_company_reply: data.is_company_reply,
        job_type: data.job_type,
        file_name: fileName,
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