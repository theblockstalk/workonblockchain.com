const chat = require('../../../model/chat');
const errors = require('../../services/errors');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    const chatDoc = await chat.findOne({
        $and:[{
        is_job_offered: 1
        },
        {
            sender_id: userId
        },
        {
            receiver_id:req.body.receiver_id
        },
        {
            msg_tag:req.body.msg_tag
        }]
    }).lean();
    if(chatDoc) {
        res.send({
            success:true,
            message: "employment offer already sent"
        });
    }
    else{
        errors.throwError("conversation not found" ,404);
    }
};