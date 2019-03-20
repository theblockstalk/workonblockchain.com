const users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const crypto = require('../../../services/crypto');

module.exports = async function (req,res)
{
    let userId = req.auth.user._id;
    const userDoc = await users.findOneById( userId );
    if(userDoc) {
        let queryBody = req.body;

        let hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.current_password, userDoc.salt)

        if (hashedPasswordAndSalt === userDoc.password_hash)
        {
            const salt = crypto.getRandomString(128);
            const hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.password, salt);

            await users.update({ _id: userId },{ $set: {'password_hash': hashedPasswordAndSalt, 'salt' : salt } });
            res.send({
                success : true
            })
        }
        else
        {
            errors.throwError("Current password is incorrect", 400);
        }
    }
    else {
        errors.throwError("User not found", 404);

    }

}