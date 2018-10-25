const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const chatDoc = await chat.findOne({
        $and:[{sender_id:userId},{msg_tag: 'job_offer'}]
    }).sort({date_created: 'descending'}).lean();
    res.send(chatDoc);
};