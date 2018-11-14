const chat = require('../../../model/chat');

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
	},{_id:0,sender_id:1,receiver_id:1,is_company_reply:1})
	.sort({date_created: 'descending'}).lean();
    res.send({datas:chatDoc});
};