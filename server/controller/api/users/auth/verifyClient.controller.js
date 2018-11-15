const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
const User = require('../../../../model/users');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');

const logger = require('../../../services/logger');

const verify_send_email = require('./verify_send_email');

module.exports = async function verify_client(req,res) {

    let queryBody = req.params;
    const userDoc = User.findOne({ email : queryBody.email }).lean();
    if(userDoc) {
        let signOptions = {
            expiresIn:  "1h",
        };
        let verifyEmailToken = jwtToken.createJwtToken(userDoc , signOptions);
        await User.update({ _id: userDoc._id },{ $set: {'verify_email_key': verifyEmailToken} });
        verify_send_email(userDoc.email , verifyEmailToken);
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("User not found", 404);
    }
}
