const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const chatDoc = await chat.findOne({
        $and:[{sender_id:userId},{msg_tag: 'job_offer'}]
    },{sender_id:1,job_title:1,salary:1,salary_currency:1,job_type:1,interview_location:1,description:1})
    .sort({date_created: 'descending'}).lean();
    res.send(chatDoc);
};