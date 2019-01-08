const settings = require('../../../settings');
var date = require('date-and-time');
const chat = require('../../../model/chat');
const mongoose = require('mongoose');

module.exports = async function (req, res) {
    let path = '';
    if(req.file){
        if (settings.isLiveApplication()) {
            path = req.file.location; // for S3 bucket
        } else {
            path = settings.FILE_URL+req.file.filename;
        }
    }
    const userId = req.auth.user._id;

    let newChat = new chat({
        sender_id : mongoose.Types.ObjectId(userId),
        receiver_id : mongoose.Types.ObjectId(req.body.receiver_id),
        msg_tag: req.body.msg_tag,
        is_read: false,
        date_created: new Date(),
        //new one
        message: {
            file: {
                url: path
            }
        }
    });
    /*let newChat = new chat({
        sender_id : mongoose.Types.ObjectId(userId),
        receiver_id : mongoose.Types.ObjectId(req.body.receiver_id),
        sender_name: req.body.sender_name,
        receiver_name: req.body.receiver_name,
        message: req.body.message,
        job_title: req.body.job_title,
        salary: req.body.salary,
        date_of_joining: req.body.date_of_joining,
        msg_tag: req.body.msg_tag,
        is_company_reply: req.body.is_company_reply,
        job_type: req.body.job_type,
        file_name: path,
        is_read: 0,
        date_created: new Date()
    });*/
    await newChat.save();
    res.send({Success:'Msg sent'});
};