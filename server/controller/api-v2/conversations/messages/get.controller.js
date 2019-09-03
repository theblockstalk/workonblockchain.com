const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const messages = require('../../../../model/mongoose/messages');
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
    await auth.isValidUser(req);

    if (req.query.admin) {
        await auth.isAdmin(req);
    }
}

module.exports.endpoint = async function (req, res) {
    let userId;
    if (req.query.user_id) {
        userId = req.query.user_id;
    }
    else{
        userId = req.auth.user._id;
    }

    //this will get sorted result from DB
    let messageDocs = await messages.findSortLimitSkip({
        $or : [
            { $and : [ { receiver_id : mongoose.Types.ObjectId(req.params.sender_id) }, { sender_id : userId } ] },
            { $and : [ { receiver_id : userId }, { sender_id : mongoose.Types.ObjectId(req.params.sender_id) } ] }
        ]
    }, {date_created: 'descending'});

    let jobOfferStatus = '';
    if (messageDocs.length === 0) {
        errors.throwError('No messages found', 404)
    }
    if(messageDocs.length >= 2 && messageDocs[1].msg_tag === 'approach_accepted') {
        jobOfferStatus = 'accepted';
    } else if (messageDocs.length >= 2 && messageDocs[1].msg_tag === 'approach_rejected') {
        jobOfferStatus = 'rejected';
    } else if(messageDocs[0].msg_tag === 'approach') {
        jobOfferStatus = 'sent';
    }

    res.send({
        messages:messageDocs,
        jobOffer: jobOfferStatus
    });
}