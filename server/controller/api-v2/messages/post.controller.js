const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');

module.exports.request = {
    type: 'post',
    path: '/messages'
};

const bodySchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    msg_tag: {
        type: String,
        enum: enumerations.chatMsgTypes,
        required: true
    }
    // message: {
    //     TODO
    // }
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.auth = async function(req) {
    console.log('in auth')
    await auth.isValidUser(req);

    // if (req.query.admin) {
    //     await auth.isAdmin(req);
    // }
}

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint')

    // TODO

    res.send('This is a response');
};