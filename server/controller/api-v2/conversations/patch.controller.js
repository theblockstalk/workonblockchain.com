const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../model/mongoose/users');

module.exports.request = {
    type: 'patch',
    path: '/conversations/:sender_id/messages/'
};

const paramSchema = new Schema({
    sender_id: String
});

module.exports.inputValidation = {
    params: paramSchema
};

module.exports.auth = async function (req) {
    console.log('in auth');
    await auth.isValidUser(req);
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
    let userId = req.auth.user._id;
    let senderId = req.params.sender_id;

    await users.update({ '_id': userId, 'conversations.user_id': senderId}, {
        $set: {
            'conversations.$.unread_count': 0
            //'conversations.$.count': 0
        }
    });
    res.send(true);
}