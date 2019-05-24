const auth = require('../../../../middleware/auth-v2');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const regexes = require('../../../../../model/regexes');
const crypto = require('../../../../services/crypto');
const jwtToken = require('../../../../services/jwtToken');
const welcomeEmail = require('../../../../services/email/emails/welcomeEmail');
const verifyEmail = require('../../../../services/email/emails/verifyEmail');
const users = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');
const google = require('../../../../services/google');
const linkedin = require('../../../../services/linkedin');
const filterReturnData = require('../../../../../../server/controller/api/users/filterReturnData');

module.exports.request = {
    type: 'post',
    path: '/users/candidates/search'
};

const querySchema = new Schema({
    is_admin: Boolean
});

module.exports.inputValidation = {
    query: querySchema
}

module.exports.auth = async function (req) {
    if(req.query.is_admin === 'true' || req.query.is_admin === true) await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    if(req.query.is_admin === 'true' || req.query.is_admin === true && req.auth.user.is_admin === 1) {
        let filteredUsers = [];
        await
        users.findAndIterate({type: 'candidate'}, async function (userDoc) {
            filterReturnData.removeSensativeData(userDoc);
            filteredUsers.push(userDoc);
        });

        if (filteredUsers && filteredUsers.length > 0) {
            res.send(filteredUsers);
        }

        else {
            errors.throwError("No candidate exists", 404)
        }
    }
    else {
        errors.throwError("Authentication failed", 400);
    }
}