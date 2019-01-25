const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../model/mongoose/users');

const messages = require('../../../model/mongoose/messages');

module.exports.request = {
    type: 'get',
    path: '/conversations/'
};

const querySchema = new Schema({
    user_id: String,
    admin: Boolean
});

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
    let userId, userDoc;

    if(req.query.admin){
        userId = req.query.user_id;
        userDoc = await users.findOneById(userId);
    }
    else{
        userId = req.auth.user._id;
        userDoc = req.auth.user;
    }

    const conversations = userDoc.conversations;


    res.send({
        conversations: conversations,
        count: TODO,
        unread_count: TODO,
        last_message: TODO
    });
}