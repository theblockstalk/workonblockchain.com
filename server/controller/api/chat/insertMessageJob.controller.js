const settings = require('../../../settings');
var date = require('date-and-time');
const chat = require('../../../model/chat');
const mongoose = require('mongoose');
const sanitize = require('../../services/sanitize');
const chatHelper = require('./chatHelpers');

module.exports = async function (req, res) {
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
    let new_description = '';
    let new_msg = '';
    if(sanitizeddescription){
        new_description = chatHelper.replaceLineBreaksHtml(sanitizeddescription);
    }
    if(sanitizedmessage){
        new_msg = chatHelper.replaceLineBreaksHtml(sanitizedmessage);
    }
    let userId = req.auth.user._id;
    if(req.body.employment_reference_id == 0){
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
            date_of_joining: req.body.date_of_joining,
            msg_tag: req.body.msg_tag,
            is_company_reply: req.body.is_company_reply,
            job_type: req.body.job_type,
            file_name: path,
            is_job_offered: req.body.job_offered,
            is_read: 0,
            date_created: new Date()
        });
        await newChat.save();
        res.send({Success:'Msg sent'});
    }
	else{
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
            date_of_joining: req.body.date_of_joining,
            msg_tag: req.body.msg_tag,
            is_company_reply: req.body.is_company_reply,
            job_type: req.body.job_type,
            file_name: path,
            is_job_offered: req.body.job_offered,
            is_read: 0,
            employment_offer_reference: mongoose.Types.ObjectId(req.body.employment_reference_id),
            date_created: new Date()
        });
        await newChat.save();
        res.send({Success:'Msg sent'});
    }
};