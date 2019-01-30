const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');
const errors = require('../../services/errors');
const sanitize = require('../../services/sanitize');
const messages = require('../../../model/mongoose/messages');
const users = require('../../../model/mongoose/users');
const multer = require('../../../controller/middleware/multer');
const object = require('../../services/objects');

module.exports.request = {
    type: 'post',
    path: '/messages'
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "photo");
}

const bodySchema = new Schema({
    receiver_id: {
        type: String,
        required: true
    },
    msg_tag: {
        type: String,
        enum: enumerations.chatMsgTypes,
        required: true
    },
    message: {
        normal: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },
        job_offer: {
            type: new Schema({
                title: {
                    type: String,
                    required: true
                },
                salary: {
                    type: Number,
                    required: true
                },
                salary_currency: {
                    type: String,
                    enum: enumerations.currencies,
                    required: true
                },
                type: {
                    type: String,
                    enum: enumerations.jobTypes,
                    required: true
                },
                description: {
                    type: String,
                    required: false
                }
            }),
            required: false
        },
        job_offer_accepted: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },
        job_offer_rejected: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },
        interview_offer: {
            type: new Schema({
                location: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                date_time: {
                    type: Date,
                    required: true
                }
            }),
            required: false
        },
        employment_offer_accepted: {
            type: new Schema({
                employment_offer_message_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Messages',
                    required: false
                },
                message: {
                    type: String,
                    required: false
                }
            }),
            required: false
        },
        employment_offer_rejected: {
            type: new Schema({
                employment_offer_message_id: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Messages'
                },
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        }
    }
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.auth = async function (req) {
    console.log('in auth');
    await auth.isValidUser(req);
}

const checkJobOfferAccepted = async function (userType, sender_id, receiver_id) {
    let messageDoc;
    if (userType === 'candidate') {
        messageDoc = await messages.findOne({
            sender_id: sender_id,
            receiver_id: receiver_id,
            msg_tag: 'job_offer_accepted'
        });
    } else {
        messageDoc = await messages.findOne({
            sender_id: receiver_id,
            receiver_id: sender_id,
            msg_tag: 'job_offer_accepted'
        });
    }
    if (!messageDoc) errors.throwError("Job offer has not been accepted", 400);
}

const checkMessageSenderType = function (userType, expectedType) {
    if (userType !== expectedType) errors.throwError("Message can only be sent by a " + expectedType, 400);
}

const checkLastEmpoymentOffer = async function (sender_id,receiver_id){
    const lastEmploymentOfferDoc = await messages.findLastJobOffer({
        sender_id: sender_id,
        receiver_id: receiver_id,
        msg_tag: 'employment_offer'
    });
    if (lastEmploymentOfferDoc) {
        const responseToOfferDoc = await messages.findOne({
            $or: [{
                "message.employment_offer_accepted.employment_offer_message_id": lastEmploymentOfferDoc._id
            }, {
                "message.employment_offer_rejected.employment_offer_message_id": lastEmploymentOfferDoc._id
            }]
        });

        if (!responseToOfferDoc) {
            errors.throwError("Last employment offer needs to be accepted or rejected before a new offer can be sent", 400);
        }
    }
}

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint');
    const userType = req.auth.user.type;
    const sender_id = req.auth.user._id;
    let newMessage;

    const receiver_id = req.body.receiver_id;
    const timestamp = Date.now();
    newMessage = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        msg_tag: req.body.msg_tag,
        date_created: timestamp,
        message: {}
    };

    const body = req.body;
    if (body.msg_tag === "file") {
        checkJobOfferAccepted(userType, sender_id, receiver_id);
        const file = {
            url: req.file.path
        };
        newMessage.message.file = file;
    }
    else if (body.msg_tag === "normal") {
        await checkJobOfferAccepted(userType, sender_id, receiver_id);

        body.message.normal.message = sanitize.sanitizeHtml(body.message.normal.message);
        body.message.normal.message = object.replaceLineBreaksHtml(body.message.normal.message);
        newMessage.message.normal = body.message.normal;
    }
    else if (body.msg_tag === "job_offer") {
        checkMessageSenderType(userType, 'company');

        const messageDoc = await messages.findOne({
            sender_id: sender_id,
            receiver_id: receiver_id,
            msg_tag: 'job_offer'
        });
        if (messageDoc) errors.throwError("Job offer already sent", 400);

        body.message.job_offer.description = sanitize.sanitizeHtml(body.message.job_offer.description);
        body.message.job_offer.description = object.replaceLineBreaksHtml(body.message.job_offer.description);
        newMessage.message.job_offer = body.message.job_offer;
    }
    else if (body.msg_tag === "job_offer_accepted") {
        checkMessageSenderType(userType, 'candidate');

        const messageDoc = await messages.findOne({
            sender_id: sender_id,
            receiver_id: receiver_id,
            msg_tag: 'job_offer_accepted'
        });
        if (messageDoc) errors.throwError("Job offer already accepted", 400);

        newMessage.message.job_offer_accepted = body.message.job_offer_accepted;
    }
    else if (body.msg_tag === "job_offer_rejected") {
        checkMessageSenderType(userType, 'candidate');

        const messageDoc = await messages.findOne({
            $or: [{
                sender_id: sender_id,
                receiver_id: receiver_id,
                msg_tag: 'job_offer_accepted'
            }, {
                sender_id: sender_id,
                receiver_id: receiver_id,
                msg_tag: 'job_offer_rejected'
            }]
        });
        if (messageDoc) errors.throwError("Job offer already accepted or rejected", 400);

        newMessage.message.job_offer_rejected = body.message.job_offer_rejected;
    }
    else if (body.msg_tag === "interview_offer") {
        checkMessageSenderType(userType, 'company');
        await checkJobOfferAccepted(userType, sender_id, receiver_id);

        if (body.message.interview_offer.description) {
            body.message.interview_offer.description = sanitize.sanitizeHtml(body.message.interview_offer.description);
            body.message.interview_offer.description = object.replaceLineBreaksHtml(body.message.interview_offer.description);
        }
        newMessage.message.interview_offer = body.message.interview_offer;
    }
    else if (body.msg_tag === "employment_offer") {
        checkMessageSenderType(userType, 'company');
        await checkJobOfferAccepted(userType, sender_id, receiver_id);
        await checkLastEmpoymentOffer(sender_id, receiver_id);

        let employment_offer = {
            title: req.body.title,
            salary: req.body.salary,
            salary_currency: req.body.salary_currency,
            type: req.body.type,
            start_date: req.body.start_date
        };
        if(req.body.description){
            req.body.description = sanitize.sanitizeHtml(req.body.description);
            req.body.description = object.replaceLineBreaksHtml(req.body.description);
            employment_offer.description = req.body.description;
        }

        console.log(newMessage);

        if(!object.isEmpty(req.file)){
            const path = req.file.path;
            console.log(path);
            if (path) {
                employment_offer.file_url = path;
            }
        }

        newMessage.message.employment_offer = employment_offer;
        console.log(employment_offer);
    }
    else if (body.msg_tag === "employment_offer_accepted") {
        checkMessageSenderType(userType, 'candidate');
        await checkJobOfferAccepted(userType, sender_id, receiver_id);

        let messageDoc = await messages.findOne({
            _id: req.body.message.employment_offer_accepted.employment_offer_message_id
        });
        if (!messageDoc) errors.throwError("Employment offer not found", 400);

        messageDoc = await messages.findOne({
            msg_status: 'employment_offer_accepted',
            "messages.employment_offer_accepted.employment_offer_message_id": req.body.message.employment_offer_accepted.employment_offer_message_id
        });
        if (messageDoc) errors.throwError("Employment offer has already been accepted", 400);

        newMessage.message.employment_offer_accepted = body.message.employment_offer_accepted;
    }
    else if (body.msg_tag === "employment_offer_rejected") {
        checkMessageSenderType(userType, 'candidate');
        await checkJobOfferAccepted(userType, sender_id, receiver_id);

        let messageDoc = await messages.findOne({
            _id: req.body.message.employment_offer_rejected.employment_offer_message_id
        });
        if (!messageDoc) errors.throwError("Employment offer not found", 400);

        messageDoc = await messages.findOne({
            msg_status: 'employment_offer_rejected',
            "messages.employment_offer_rejected.employment_offer_message_id": req.body.message.employment_offer_rejected.employment_offer_message_id
        });
        if (messageDoc) errors.throwError("Employment offer has already been rejected", 400);

        newMessage.message.employment_offer_rejected = body.message.employment_offer_rejected;
    }

    let senderConv, senderSelect, senderUpdate;
    if (req.auth.user.conversations) {
        const conversations = req.auth.user.conversations;
        senderConv = conversations.filter(item => String(item.user_id) ===  receiver_id);

        if (senderConv && senderConv.length > 0) {
            console.log('in if 1st if');
            let count = senderConv[0].count + 1;
            senderSelect = { '_id': sender_id, 'conversations._id': senderConv[0]._id };
            senderUpdate = { $set: {
                'conversations.$.user_id': receiver_id,
                'conversations.$.count': count,
                'conversations.$.unread_count': 0,
                'conversations.$.last_message': timestamp
            }}
        }
        else {
            console.log('in else');
            senderSelect = { '_id': sender_id }
            senderUpdate = { $push: { conversations: {
                user_id: receiver_id,
                count: 1,
                unread_count: 0,
                last_message: timestamp
            }}}
        }
    }
    else {
        senderSelect = { '_id': sender_id }
        senderUpdate = { $push: { conversations: {
            user_id: receiver_id,
            count: 1,
            unread_count: 0,
            last_message: timestamp
        }}}
    }

    let receiverConv, receiverSelect, receiverUpdate;
    const receiverUserDoc = await users.findOneById(receiver_id);
    if (receiverUserDoc.conversations) {
        const conversations = receiverUserDoc.conversations;
        receiverConv = conversations.filter(item => String(item.user_id) === String(sender_id));
        console.log('receiver');

        if (receiverConv && receiverConv.length>0) {
            console.log('in if 2nd');
            let count = receiverConv[0].count + 1;
            let unread_count = receiverConv[0].unread_count + 1;
            receiverSelect = {'_id': receiver_id, 'conversations._id': receiverConv[0]._id};
            receiverUpdate = {
                $set: {
                    'conversations.$.user_id': sender_id,
                    'conversations.$.count': count,
                    'conversations.$.unread_count': unread_count,
                    'conversations.$.last_message': timestamp
                }
            }
        }
        else {
            console.log('in else 2nd');
            receiverSelect = { '_id': receiver_id }
            receiverUpdate = { $push: { conversations: {
                user_id: sender_id,
                count: 1,
                unread_count: 0,
                last_message: timestamp
            }}}
        }
    }
    else {
        receiverSelect = { '_id': receiver_id }
        receiverUpdate = { $push: { conversations: {
            user_id: sender_id,
            count: 1,
            unread_count: 1,
            last_message: timestamp
        }}}
    }

    const messageDoc = await messages.insert(newMessage);
    await users.update(senderSelect, senderUpdate);
    await users.update(receiverSelect, receiverUpdate);
    res.send(messageDoc);
}