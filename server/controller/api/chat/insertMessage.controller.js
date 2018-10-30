const settings = require('../../../settings');
var _ = require('lodash');
var date = require('date-and-time');
var Q = require('q');
const chat = require('../../../model/chat');
const mongoose = require('mongoose');
const sanitize = require('../../services/sanitize');

const logger = require('../../services/logger');

//////////inserting message in DB ////////////

module.exports = function insert_message(req, res)
{
    let sanitizeddescription = sanitize.sanitizeHtml(req.unsanitizedBody.description);
    let sanitizedmessage = sanitize.sanitizeHtml(req.unsanitizedBody.message);

    let userId = req.auth.user._id;

    insert_message_new(req.body,sanitizeddescription,sanitizedmessage,userId).then(function (data)
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

function insert_message_new(data,description,msg,sender_id){
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
	interview_date = '';
	if(data.msg_tag == 'interview_offer'){
		interview_date = data.date_of_joining+' '+data.interview_time+':00';
	}
	var current_date = new Date();
	my_date = date.format(current_date, 'MM/DD/YYYY HH:mm:ss');
    var deferred = Q.defer();
    let newChat = new chat({
        sender_id : mongoose.Types.ObjectId(sender_id),
		receiver_id : mongoose.Types.ObjectId(data.receiver_id),
        sender_name: data.sender_name,
        receiver_name: data.receiver_name,
        message: new_msg,
		description: new_description,
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