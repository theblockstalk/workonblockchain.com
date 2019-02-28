const auth = require('../../../../middleware/auth-v2');
const users = require('../../../../../model/mongoose/users');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../../model/enumerations');
const errors = require('../../../../services/errors');

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
    console.log(req.body);
}

