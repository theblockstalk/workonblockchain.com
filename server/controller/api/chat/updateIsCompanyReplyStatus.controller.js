const chat = require('../../../model/chat');
const mongoose = require('mongoose');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    let set =
        {
            is_company_reply: req.body.status,

        };

    await chat.update({receiver_id: userId},{ $set: set },{multi: true});
    res.send(set);
};