var date = require('date-and-time');
const chat = require('../../../model/chat');
const mongoose = require('mongoose');
const sanitize = require('../../services/sanitize');
const chatHelper = require('./chatHelpers');

//////////inserting message in DB ////////////

module.exports = async function (req, res) {
    let sanitizeddescription = sanitize.sanitizeHtml(req.unsanitizedBody.description);
    let sanitizedmessage = sanitize.sanitizeHtml(req.unsanitizedBody.message);
    let new_description = '';
    let new_msg = '';
    if(sanitizeddescription){
        new_description = chatHelper.replaceLineBreaksHtml(sanitizeddescription);
    }
    if(sanitizedmessage){
        new_msg = chatHelper.replaceLineBreaksHtml(sanitizedmessage);
    }

    let userId = req.auth.user._id;

    let interview_date = '';
    if(req.body.msg_tag === 'interview_offer'){
        interview_date = req.body.date_of_joining+' '+req.body.interview_time+':00';
    }

    let newChat = new chat({
        sender_id : mongoose.Types.ObjectId(userId),
        receiver_id : mongoose.Types.ObjectId(req.body.receiver_id),
        sender_name: req.body.sender_name,
        receiver_name: req.body.receiver_name,
        message: new_msg,
        description: new_description,
        job_title: req.body.job_title,
        salary: req.body.salary,
        salary_currency: req.body.currency,
        date_of_joining: '',
        msg_tag: req.body.msg_tag,
        is_company_reply: req.body.is_company_reply,
        job_type: req.body.job_type,
        is_read: 0,
        interview_location: req.body.interview_location,
        interview_date_time: interview_date,
        date_created: new Date()
    });
    await newChat.save();
    res.send({Success:'Msg sent'});
};