const users = require('../../../../model/mongoose/users');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');

const logger = require('../../../services/logger');

const verify_send_email = require('./verify_send_email');

module.exports = async function verify_client(req,res) {

    let queryBody = req.params;
    const userDoc = await users.findOneByEmail( queryBody.email );
    if(userDoc) {
        let signOptions = {
            expiresIn:  "1h",
        };
        let verifyEmailToken = jwtToken.createJwtToken(userDoc , signOptions);
        await users.update({ _id: userDoc._id },{ $set: {'verify_email_key': verifyEmailToken} });
        const data = await verify_send_email(userDoc.email , verifyEmailToken);
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("User not found", 404);
    }
}
