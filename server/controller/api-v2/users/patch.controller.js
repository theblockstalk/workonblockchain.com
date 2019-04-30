const auth = require('../../middleware/auth-v2');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');
const regexes = require('../../../model/regexes');
const multer = require('../../../controller/middleware/multer');

const users = require('../../../model/mongoose/users');
const filterReturnData = require('../../api/users/filterReturnData');
const objects = require('../../services/objects');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id'
};
const paramSchema = new Schema({
    user_id: String
});

const bodySchema = new Schema({
    marketing_emails: {
        type:Boolean,
        default:false
    },
    candidate: {
        type: {
            terms_id: {
                type: Schema.Types.ObjectId,
                ref: 'pages_content'
            }
        }
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};


module.exports.auth = async function (req) {
    await auth.isValidUser(req);
}


module.exports.endpoint = async function (req, res) {

}