const User = require('../../../../model/users');
const jwtToken = require('../../../services/jwtToken');

module.exports = async function (req, res) {
    const verifyEmailHash = req.params.email_hash;
    const userDoc = await User.findOne({ verify_email_key: verifyEmailHash }).lean();

    if(userDoc) {
        const payloaddata = jwtToken.verifyJwtToken(verifyEmailHash);
        if((payloaddata.exp - payloaddata.iat) === 3600){
            await User.update({ _id: userDoc._id },{ $set: {is_verify: 1 } });
            res.send({
                success : true,
                msg : "Email Verified"
            })

        }
        else{
            res.send({
                success : false,
                error : "The verification link has expired or is invalid."
            })
        }
    }
    else {
        res.send({
            success : false,
            error : "The verification link has expired or is invalid."
        })
    }
};
