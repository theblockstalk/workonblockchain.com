const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const Messages = require('../../../model/messages'); // TODO need to change to messages schema

module.exports.request = {
    type: 'get',
    path: '/conversations/'
};

const querySchema = new Schema({
    user_id: String,
    admin: Boolean
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    console.log('in auth');
    await auth.isValidUser(req);

    if (req.query.admin) {
        await auth.isAdmin(req);
    }
}

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint');
    //const userType = req.auth.user.type;
    let userId;

    if(req.query.user_id && req.query.user_id !== '0'){
        userId = req.query.user_id;
    }
    else{
        userId = req.auth.user._id;
    }

    const messageDoc = await Messages.find({
        $or:[{receiver_id:userId},{sender_id: userId}]
    },{_id:0,sender_id:1,receiver_id:1,msg_tag:1})
        .sort({date_created: 'descending'}).lean();
    res.send({
        conversations:messageDoc
    });
}