const chat = require('../../../model/chat');
const mongoose = require('mongoose');

module.exports = async function (req, res) {
    var set =
        {
            is_company_reply: req.body.status,

        };

    await chat.update({receiver_id: mongoose.Types.ObjectId(req.body.id)},{ $set: set },{multi: true});
    res.send(set);
};