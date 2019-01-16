const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const Messages = require('../../../model/messages'); // TODO need to change to messages schema

module.exports.request = {
    type: 'get',
    path: '/conversations/'
};

const querySchema = new Schema({
    id: String
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

    if(req.query.id && req.query.id !== '0' && req.auth.user.is_admin){
        userId = req.query.id;
    }
    else{
        userId = req.auth.user._id;
    }

    const messageDoc = await Messages.find({
        $or:[{receiver_id:userId},{sender_id: userId}]
    },{_id:0,sender_id:1,receiver_id:1,msg_tag:1})
        .sort({date_created: 'descending'}).lean();
    res.send(messageDoc);
}