const auth = require('../../../../middleware/auth-v2');
const users = require('../../../../../model/mongoose/users');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../../model/enumerations');
const errors = require('../../../../services/errors');
const candidateHistoryEmail = require('../../../../services/email/emails/candidateHistory');


module.exports.request = {
    type: 'post',
    path: '/users/:user_id/candidates/status'
};
const paramSchema = new Schema({
    user_id: String
});
const bodySchema = new Schema({
    history : {
        type : [{
            status:{
                type:[{
                    status: {
                        type: String,
                        enum: enumerations.candidateStatus,
                        required:true,
                    },
                    reason: {
                        type: String,
                        enum: enumerations.statusReasons
                    },
                    timestamp: {
                        type: Date,
                        required:true,
                    }
                }],
                required: false
            },
            note : String,
            email_text : String
        }]
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    const userId = req.params.user_id;
    let userDoc = await users.findOneById(userId);

    if(userDoc) {
        let queryInput = req.body;
        let history = {};
        let set = {};
        if(queryInput.note) history['note'] = queryInput.note;
        if(queryInput.email_text) history['email_text'] = queryInput.email_text;
        if(queryInput.status) {
            let status = {};
            if(queryInput.status) status.status = queryInput.status;
            if(queryInput.reason) status.reason = queryInput.reason;
            status.timestamp = new Date();
            history['status'] = status;
        }

        if(!userDoc.first_approved_date) set.first_approved_date = new Date();
        await users.update({_id: userId}, {
                $push: {
                    'candidate.history': {
                        $each: [history],
                        $position: 0
                    }
                },
                $set : set
        });

        if(queryInput.email_text) {
            candidateHistoryEmail.sendEmail(userDoc.email, userDoc.first_name, queryInput.email_text, userDoc.disable_account);
        }

        userDoc = await users.findOneById(userId);
        res.send(userDoc);

    }
    else {
        errors.throwError("User not found", 404)
    }

}

