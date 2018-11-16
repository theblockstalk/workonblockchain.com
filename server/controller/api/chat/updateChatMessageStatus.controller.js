const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    let set =
    {
        is_read: 1,

    };

    await chat.update({$and : [
        {
            receiver_id: userId
        },
        {
            sender_id: req.body.receiver_id
        },
        {
            is_read:req.body.status
        }
    ]},{ $set: set },{multi: true});
    res.send(set);
};