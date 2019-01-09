const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');
const errors = require('../../services/errors');
const messages = require('../../../model/mongoose/users'); // TODO need to change to messages schema

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
    }
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

    const body = req.body;

    const userType = req.auth.user.type;
    const sender_id = req.auth.user._id;
    const receiver_id = body.user_id;
    let newMessage = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        msg_tag: body.msg_tag,
        is_read: false,
        date_created: Date.now(),
        message: {}
    };

    if (body.msg_tag === "file") {
        // TODO ...
    }
    else if (body.msg_tag === "normal") {
        let messageDoc;
        if (userType === 'candidate') {
            messageDoc = messages.findOne({
                sender_id: sender_id,
                receiver_id: receiver_id,
                msg_tag: 'job_offer_accepted'
            });
        } else {
            messageDoc = messages.findOne({
                sender_id: receiver_id,
                receiver_id: sender_id,
                msg_tag: 'job_offer_accepted'
            });
        }
        if (messageDoc) errors.throwError("Job offer has not been accepted", 400);

        newMessage.message.normal = body.message.normal;
    }
    else if (body.msg_tag === "job_offer") {
        if (userType !== 'company') errors.throwError("Job offer can only be set by a company", 400);

        const messageDoc = messages.findOne({
            sender_id: sender_id,
            receiver_id: receiver_id,
            msg_tag: 'job_offer'
        });
        if (messageDoc) errors.throwError("Job offer already sent", 400);

        newMessage.message.job_offer = body.message.job_offer;
    }
    const messageDoc = await messages.insert(newMessage);

    res.send(messageDoc);
};