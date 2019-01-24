const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const messages = require('../../../model/mongoose/messages');
const mongoose = require('mongoose');

module.exports.request = {
    type: 'patch',
    path: '/conversations/:sender_id/messages/'
};

const paramSchema = new Schema({
    sender_id: String
});
const querySchema = new Schema({
    is_read: Boolean
})

module.exports.inputValidation = {
    query: querySchema,
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

    const updateResult = await messages.findAndUpdate(
        {$and : [
            {
                receiver_id: userId
            },
            {
                sender_id: mongoose.Types.ObjectId(req.params.sender_id)
            },
            {
                is_read: false
            }
        ]},{is_read:req.query.is_read}
    );
    res.send({
        updatedCount: updateResult.nModified
    });
}