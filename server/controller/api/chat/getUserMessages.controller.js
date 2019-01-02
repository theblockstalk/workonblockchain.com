const chat = require('../../../model/chat');
const errors = require('../../services/errors');

module.exports = async function (req, res) {
    let userId;
    if(req.body.id && req.auth.user.is_admin){
        userId = req.body.id;
    }
    else{
        userId = req.auth.user._id;
    }

    const chatDoc = await chat.find({
        $or:[{receiver_id:userId},{sender_id: userId}]
	},{_id:0,sender_id:1,receiver_id:1,msg_tag:1})
	.sort({date_created: 'descending'}).lean();
    if(chatDoc) {
        res.send({datas: chatDoc});
    }
    else{
        errors.throwError('Conversation not found', 404);
    }
};