const users = require('../../../../model/mongoose/users');
const companies = require('../../../../model/mongoose/company');
const jwtToken = require('../../../services/jwtToken');
const crypto = require('crypto');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    let queryBody = req.body;
    let userDoc =  await users.findOneByEmail(queryBody.email);
    let userId = userDoc._id;
    if(userDoc) {
        if(queryBody.linkedin_id) {
            if(userDoc  && !userDoc.linkedin_id){
                await updateSocialId(userId, {'linkedin_id': queryBody.linkedin_id});
            }
            const authenticateRes = await socialAuthentication({'linkedin_id': queryBody.linkedin_id});
            res.send(authenticateRes);
        }
        else if(queryBody.google_id) {
            if(userDoc  && !userDoc.google_id){
                await updateSocialId(userId, {'google_id': queryBody.google_id});
            }
            const authenticateRes = await socialAuthentication({'google_id': queryBody.google_id});
            res.send(authenticateRes);

        }
        else
        {

            let hash = crypto.createHmac('sha512', userDoc.salt);
            hash.update(queryBody.password);
            let hashedPasswordAndSalt = hash.digest('hex');

            if (hashedPasswordAndSalt === userDoc.password_hash)
            {
                if(userDoc.type === 'candidate') {
                    let jwtUserToken = jwtToken.createJwtToken(userDoc);
                    await users.update({_id: userDoc._id}, {$set: {'jwt_token': jwtUserToken}});
                    res.send({
                        _id: userDoc._id,
                        _creator : userDoc._id, // remove this after chat refactor
                        email: userDoc.email,
                        email_hash: userDoc.email_hash,
                        is_admin: userDoc.is_admin,
                        type: userDoc.type,
                        is_approved: userDoc.is_approved,
                        jwt_token: jwtUserToken
                    });
                }

                if(userDoc.type === 'company') {
                    let jwtUserToken = jwtToken.createJwtToken(userDoc);
                    await users.update({_id: userDoc._id}, {$set: {'jwt_token': jwtUserToken}});
                    const companyDoc = await companies.findOne({ _creator:  userDoc._id });
                    res.send({
                        _id: companyDoc._id,
                        _creator: userDoc._id,
                        email: userDoc.email,
                        email_hash: userDoc.email_hash,
                        is_admin: userDoc.is_admin,
                        type: userDoc.type,
                        is_approved: userDoc.is_approved,
                        jwt_token: jwtUserToken,
                        created_date : userDoc.created_date
                    });
                }

            }
            else
            {
                errors.throwError("Incorrect Password" , 400)
            }


        }
    }
    else {
        errors.throwError("User not found" , 404)

    }



}

async function updateSocialId(id, selector){
    await users.update({_id: id}, {$set: selector});
}

async function socialAuthentication(selector) {
    let userDoc =  await users.findOne(selector);
    if(userDoc) {
        let jwtUserToken = jwtToken.createJwtToken(userDoc);
        await users.update({_id: userDoc._id}, {$set: {'jwt_token': jwtUserToken}});
        return {
            _id:userDoc._id,
            _creator: userDoc._id, //remove this after chat refactor
            email: userDoc.email,
            email_hash: userDoc.email_hash,
            is_admin:userDoc.is_admin,
            type:userDoc.type,
            is_approved : userDoc.is_approved,
            jwt_token: jwtUserToken
        };
    }
    else {
        errors.throwError("User not found" , 404)
    }
}

