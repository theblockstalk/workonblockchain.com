const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const messages = require('../../../../model/messages');
const mongoose = require('mongoose');

module.exports.request = {
    type: 'get',
    path: '/conversations/:sender_id/messages/'
};

const paramSchema = new Schema({
    sender_id: String
})

const querySchema = new Schema({
    receiver_id: String,
    admin: Boolean
})

module.exports.inputValidation = {
    params: paramSchema,
    query: querySchema
};

module.exports.auth = async function (req) {
    console.log('in auth');
    await auth.isValidUser(req);

    if (req.query.admin) {
        await auth.isAdmin(req);
    }
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
    if (req.query.receiver_id) {
        userId = req.query.receiver_id;
    }
    else{
        userId = req.auth.user._id;
    }

    console.log(userId);
    console.log(req.query);
    const messageDocs = await messages.find({
        $or : [
            { $and : [ { receiver_id : mongoose.Types.ObjectId(req.params.sender_id) }, { sender_id : userId } ] },
            { $and : [ { receiver_id : userId }, { sender_id : mongoose.Types.ObjectId(req.params.sender_id) } ] }
        ]
    }).sort({_id: 'ascending'}).lean();

    let jobOfferStatus = [];
    for(let i=0; i< messageDocs.length; i++){
        if (messageDocs[i].msg_tag === 'job_offer_accepted'){
            jobOfferStatus.push('accepted');
        }
        else if (messageDocs[i].msg_tag === 'job_offer_rejected'){
            jobOfferStatus.push('rejected');
        }
        else if (messageDocs[i].msg_tag === 'job_offer'){
            jobOfferStatus.push('sent');
        }
    }
    console.log(jobOfferStatus);

    res.send({
        messages:messageDocs,
        jobOffer: jobOfferStatus
    });
}