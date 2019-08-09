const users = require('../../../../../../model/mongoose/users');
const errors = require('../../../../../services/errors');
const crypto = require('../../../../../services/crypto');
const Schema = require('mongoose').Schema;
const jwtToken = require('../../../../../services/jwtToken');

module.exports.request = {
    type: 'put',
    path: '/users/auth/password/reset'
};

const bodySchema = new Schema({
    forgot_password_token: String,
    new_password: String
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.endpoint = async function (req, res) {
    let passwordToken = req.body.forgot_password_token;
    let queryBody = req.body;

    let payloaddata = jwtToken.verifyJwtToken(passwordToken);
    if((payloaddata.exp - payloaddata.iat) === 3600) {
        const userDoc = await users.findOne({ forgot_password_key : passwordToken});
        if(userDoc) {
            const salt = crypto.getRandomString(128);
            const hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.new_password, salt);

            await users.update({ _id: userDoc._id },{ $set: {'password_hash': hashedPasswordAndSalt ,'salt' : salt } });
            res.send({
                success : true ,
                msg : 'Password reset successfully'
            })
        }
        else {
            errors.throwError("User not found", 404);
        }
    }
    else {
        errors.throwError("Link expired", 400);
    }
}