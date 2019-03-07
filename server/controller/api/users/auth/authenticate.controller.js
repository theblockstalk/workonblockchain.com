const users = require('../../../../model/mongoose/users');
const companies = require('../../../../model/mongoose/company');
const jwtToken = require('../../../services/jwtToken');
const crypto = require('crypto');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    let queryBody = req.body;
    let userDoc =  await users.findOneByEmail(queryBody.email);
    let set = {};
    let response = {
        _id:userDoc._id,
        _creator: userDoc._id,
        email: userDoc.email,
        is_admin:userDoc.is_admin,
        type:userDoc.type,
        is_approved : userDoc.is_approved,
    }
    if(userDoc) {
        if(queryBody.linkedin_id) {
            if(!userDoc.linkedin_id){
                set.linkedin_id = queryBody.linkedin_id;
            }
            else if(userDoc.linkedin_id !== queryBody.linkedin_id) {
                errors.throwError("User not found" , 404)

            }
            else { }

        }
        else if(queryBody.google_id) {
            if(!userDoc.google_id){
                set.google_id = queryBody.google_id;
            }
            else if(userDoc.google_id !== queryBody.google_id) {
                errors.throwError("User not found" , 404)

            }
            else {}

        }
        else
        {
            let hash = crypto.createHmac('sha512', userDoc.salt);
            hash.update(queryBody.password);
            let hashedPasswordAndSalt = hash.digest('hex');

            if (hashedPasswordAndSalt === userDoc.password_hash)
            {
                if(userDoc.type === 'company') {
                    const companyDoc = await companies.findOne({ _creator:  userDoc._id });
                    response._id = companyDoc._id;
                    response.created_date = userDoc.created_date;
                }
            }
            else
            {
                errors.throwError("Incorrect Password" , 400)
            }
        }

        const jwtUserToken = jwtToken.createJwtToken(userDoc);
        set.jwt_token = jwtUserToken;
        await users.update({_id: userDoc._id}, {$set: set});
        response.jwt_token = jwtUserToken;
        res.send(response);
    }
    else {
        errors.throwError("User not found" , 404)

    }



}