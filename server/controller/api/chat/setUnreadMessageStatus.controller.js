const users = require('../../../model/users');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    let set =
        {
            is_unread_msgs_to_send: req.body.status,

        };

    await users.update({ _id: userId},{ $set: set });
    res.send(set);
};