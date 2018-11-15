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
        errors.throwError('Employment offer found', 404);
    }
    else{
        res.send({success:false})
    }
};