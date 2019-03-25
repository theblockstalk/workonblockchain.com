const users = require('../../../../model/mongoose/users');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');
const crypto = require('../../../services/crypto');

module.exports = async function (req,res) {

    let passwordHash = req.params.hash;
    let queryBody = req.body;

    let payloaddata = jwtToken.verifyJwtToken(passwordHash);
    if((payloaddata.exp - payloaddata.iat) === 3600) {
        const userDoc = await users.findOne({ forgot_password_key : passwordHash});
        if(userDoc) {
            const salt = crypto.getRandomString(128);
            const hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.password, salt);

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

