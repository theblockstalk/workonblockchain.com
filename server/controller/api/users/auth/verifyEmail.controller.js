const users = require('../../../../model/mongoose/users');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const verifyEmailHash = req.params.email_hash;
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
};
