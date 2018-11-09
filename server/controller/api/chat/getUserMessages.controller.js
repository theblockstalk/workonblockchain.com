const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const chatDoc = await chat.find({
        $or:[{receiver_id:userId},{sender_id: userId}]
	},{_id:0,sender_id:1,receiver_id:1,is_company_reply:1})
	.sort({date_created: 'descending'}).lean();
    res.send({datas:chatDoc});
};