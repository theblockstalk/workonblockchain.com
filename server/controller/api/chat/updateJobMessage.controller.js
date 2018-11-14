const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    var set =
        {
            is_job_offered: req.body.status,

        };

    await chat.update({ _id: req.body.id},{ $set: set });
    res.send(set);
};