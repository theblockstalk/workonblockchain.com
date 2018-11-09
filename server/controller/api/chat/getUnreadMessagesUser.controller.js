const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    const chatDoc = await chat.count({
        $and : [
            {
                $and:[{receiver_id:userId},{sender_id: req.body.sender_id}]
            },
            {
                is_read:0
            }
        ]
    }).lean();
    res.send({
        receiver_id: userId,
        sender_id: req.body.sender_id,
        number_of_unread_msgs:chatDoc
    });
};