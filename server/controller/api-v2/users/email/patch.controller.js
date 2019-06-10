const Schema = require('mongoose').Schema;
const users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const jwtToken = require('../../../services/jwtToken');

module.exports.request = {
    type: 'patch',
    path: '/users/email'
};

const querySchema = new Schema({
    verify_email_token: String
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.endpoint = async function (req, res) {
    const verifyEmailHash = req.query.verify_email_token;
    const userDoc = await users.findOne({ verify_email_key: verifyEmailHash });

    if(userDoc) {
        const payloaddata = jwtToken.verifyJwtToken(verifyEmailHash);
        if((payloaddata.exp - payloaddata.iat) === 3600){
            await users.update({ _id: userDoc._id },{ $set: {is_verify: 1 } });
            res.send({
                success : true,
                msg : "Email Verified"
            })

        }
        else{
            errors.throwError("The verification link has expired or is invalid.", 400);
        }
    }
    else {
        errors.throwError("The verification link has expired or is invalid.", 400);
    }
}