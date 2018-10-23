const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    const message_tag = 'job_offer';

    const chatDoc = await chat.findOne({
        $and:[{sender_id:userId},{msg_tag: message_tag}]
    },{sender_id:1,job_title:1,salary:1,salary_currency:1,job_type:1,interview_location:1,description:1})
    .sort({_id: 'descending'}).lean();
    res.send({
        datas: chatDoc
    });
};