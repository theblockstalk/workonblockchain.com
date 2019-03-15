const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const regexes = require('../../../../model/regexes');
const crypto = require('crypto');
const jwtToken = require('../../../services/jwtToken');
const welcomeEmail = require('../../../services/email/emails/welcomeEmail');
const verifyEmail = require('../../../services/email/emails/verifyEmail');
const users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const candidateHelper = require('../candidates/candidateHelper');


module.exports.request = {
    type: 'post',
    path: '/users/auth'
};


const bodySchema = new Schema({
    email: {
        type:String,
        validate: regexes.email,
        lowercase: true,
    },

    linkedin_code : {
        type: String
    },
    google_code : {
        type: String
    },
    password: {
        type:String,
    },
});

module.exports.inputValidation = {
    body: bodySchema
}


module.exports.endpoint = async function (req, res) {
    let queryBody = req.body;
    console.log(queryBody);
    let set = {};
    let userDoc;
    if(queryBody.email){
        userDoc = await users.findOneByEmail(queryBody.email);
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
    else if(queryBody.google_code)
    {
        const googleData = await candidateHelper.googleAuth(queryBody.google_code);
        if (googleData) {
            userDoc = await users.findOne({google_id: googleData.google_id});
            if (userDoc && !userDoc.google_id) {
                set.google_id =  googleData.google_id;

            }
            else if (googleData.email !== userDoc.email) {
                errors.throwError("Incorrect email address", 400)
            }
            else {}

        }
        else {
            errors.throwError('Something went wrong. Please try again.', 400);
        }

    }
    else if(queryBody.linkedin_code) {
        const linkedinData = await candidateHelper.linkedinAuth(queryBody.linkedin_code);
        console.log(linkedinData);
        if (linkedinData) {
            userDoc = await users.findOne({linkedin_id: linkedinData.linkedin_id});
            if (userDoc && !userDoc.linkedin_id) {
                set.linkedin_id =  linkedinData.linkedin_id;

            }
            else if (linkedinData.email !== userDoc.email) {
                errors.throwError("Incorrect email address", 400)
            }
            else {}

            }
        else {
            errors.throwError('Something went wrong. Please try again.', 400);
        }

    }
    else {
        errors.throwError('Invalid input body', 400);
    }

    if(userDoc){
        let response = {
            _id:userDoc._id,
            _creator: userDoc._id,
            email: userDoc.email,
            type:userDoc.type,
        }

        const jwtUserToken = jwtToken.createJwtToken(userDoc);
        set.jwt_token = jwtUserToken;
        await users.update({_id: userDoc._id}, {$set: set});
        response.jwt_token = jwtUserToken;
        res.send(response);

    }
    else {
        errors.throwError("User not found" , 404);
    }


}