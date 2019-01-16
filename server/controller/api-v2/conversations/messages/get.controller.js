const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const Messages = require('../../../../model/messages');
const mongoose = require('mongoose');

module.exports.request = {
    type: 'get',
    path: '/conversations/messages/'
};

const querySchema = new Schema({
    sender_id: String,
    receiver_id: String
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    console.log('in auth');
    await auth.isValidUser(req);

    // if (req.query.admin) {
    //     await auth.isAdmin(req);
    // }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint');
    //const userType = req.auth.user.type;
    let userId;

    if(req.query.sender_id !== '0' && req.auth.user.is_admin){
        userId = req.query.sender_id
    }
    else{
        userId = req.auth.user._id;
    }

    const messageDoc = await Messages.find({
        $or : [
            { $and : [ { receiver_id : mongoose.Types.ObjectId(req.query.receiver_id) }, { sender_id : userId } ] },
            { $and : [ { receiver_id : userId }, { sender_id : mongoose.Types.ObjectId(req.query.receiver_id) } ] }
        ]
    }).sort({_id: 'ascending'}).lean();

    res.send(messageDoc);
}