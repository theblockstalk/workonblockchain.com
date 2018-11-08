const chat = require('../../../model/chat');

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const chatDoc = await chat.findOne({
        $and:[{
            $and:[{receiver_id:req.body.receiver_id},{sender_id: userId}]
        },
        {
            msg_tag:req.body.msg_tag
        }]
    }).lean();
    if(chatDoc){
        res.send({
            datas: chatDoc
        });
    }
    else{
        res.send({
            datas: 0
        });
    }
};