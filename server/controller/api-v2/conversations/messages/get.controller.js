const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const messages = require('../../../../model/messages');
const mongoose = require('mongoose');
const errors = require('../../../services/errors');

module.exports.request = {
    type: 'get',
    path: '/conversations/:sender_id/messages/'
};

const paramSchema = new Schema({
    sender_id: String
})

const querySchema = new Schema({
    user_id: String,
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

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint');
    let userId;
    if (req.query.user_id) {
        userId = req.query.user_id;
    }
    else{
        userId = req.auth.user._id;
    }

    console.log('sender: ' + userId);
    console.log('receiver: ' + req.params.sender_id);
    const messageDocs = await messages.find({
        $or : [
            { $and : [ { receiver_id : mongoose.Types.ObjectId(req.params.sender_id) }, { sender_id : userId } ] },
            { $and : [ { receiver_id : userId }, { sender_id : mongoose.Types.ObjectId(req.params.sender_id) } ] }
        ]
    }).sort({_id: 'ascending'}).lean();

    let jobOfferStatus = '';
    if (messageDocs.length === 0) {
        errors.throwError('No messages found', 404)
    }
    if(messageDocs.length >= 2 && messageDocs[1].msg_tag === 'job_offer_accepted') {
        jobOfferStatus = 'accepted';
    } else if (messageDocs.length >= 2 && messageDocs[1].msg_tag === 'job_offer_rejected') {
        jobOfferStatus = 'rejected';
    } else if(messageDocs[0].msg_tag === 'job_offer') {
        jobOfferStatus = 'sent';
    }

    res.send({
        messages:messageDocs,
        jobOffer: jobOfferStatus
    });
}