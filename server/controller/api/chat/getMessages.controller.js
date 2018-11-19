const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    let userId;
    if(req.body.sender_id && req.auth.user.is_admin){
        userId = req.body.sender_id;
    }
    else{
        userId = req.auth.user._id;
    }

    const chatDoc = await chat.find({
        $or : [
            { $and : [ { receiver_id : req.body.receiver_id }, { sender_id : userId } ] },
            { $and : [ { receiver_id : userId }, { sender_id : req.body.receiver_id } ] }
        ]
    }).sort({_id: 'ascending'}).lean();
    res.send({
        datas:chatDoc
    });
};