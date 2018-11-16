const User = require('../../../../model/users');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');
const crypto = require('crypto');

module.exports = async function (req,res) {

    let passwordHash = req.params.hash;
    let queryBody = req.body;

    let payloaddata = jwtToken.verifyJwtToken(passwordHash);
    if((payloaddata.exp - payloaddata.iat) === 3600) {
        const userDoc = await User.findOne({ forgot_password_key : passwordHash}).lean();
        if(userDoc) {
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt);
            hash.update(queryBody.password);
            let hashedPasswordAndSalt = hash.digest('hex');
            await User.update({ _id: userDoc._id },{ $set: {'password_hash': hashedPasswordAndSalt ,'salt' : salt } });
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

