const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');
const errors = require('../../services/errors');
// const messages = require('../../../model/mongoose/users'); // TODO need to change to messages schema

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
        // file: {
        //     url: {
        //         type: String,
        //         required: true,
        //         validate: regexes.url
        //     }
        // },
        // normal: {
        //     message: {
        //         type: String,
        //         required: true
        //     }
        // },
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

    }
    else if (body.msg_tag === "normal") {
        // TODO create
    }
    else if (body.msg_tag === "job_offer") {
        // const messageDoc = messages.findOne({
        //     sender_id: sender_id,
        //     receiver_id: receiver_id,
        //     msg_tag: 'job_offer'
        // });
        // if (messageDoc) errors.throwError("Job offer already sent", 400);
        //
        // newMessage.message.job_offer = body.message.job_offer;
    }
    // messages.insert(newMessage);

    res.send('This is a response');
};