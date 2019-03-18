const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const regexes = require('../../../../model/regexes');
const crypto = require('../../../services/crypto');
const jwtToken = require('../../../services/jwtToken');
const users = require('../../../../model/mongoose/users');
const companies = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');
const google = require('../../../services/google');
const linkedin = require('../../../services/linkedin');


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
        validate: regexes.password
    },
});

module.exports.inputValidation = {
    body: bodySchema
}


module.exports.endpoint = async function (req, res) {
    let queryBody = req.body;
    let set = {};
    let userDoc;
    let companyDoc;
    if(queryBody.email){
        userDoc = await users.findOneByEmail(queryBody.email);
        let hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.password, userDoc.salt)

        if (hashedPasswordAndSalt === userDoc.password_hash)
        {
            if(userDoc.type === 'company') {
                companyDoc = await companies.findOne({ _creator:  userDoc._id });
            }
        }
        else
        {
            errors.throwError("Incorrect Password" , 400)
        }
    }
    else if(queryBody.google_code)
    {
        const googleData = await google.googleAuth(queryBody.google_code);
        if (googleData) {
            userDoc = await users.findOneByEmail(googleData.email);

            if (userDoc.google_id && userDoc.google_id !== googleData.google_id) {
                throw new Error("Incorrect google id");
            }
            if (!userDoc.google_id) {
                set.google_id =  googleData.google_id;
            }

        }
        else {
            errors.throwError('There was a problem with your google identity', 400);
        }

    }
    else if(queryBody.linkedin_code) {
        const linkedinData = await linkedin.linkedinAuth(queryBody.linkedin_code);
        if (linkedinData) {
            userDoc = await users.findOneByEmail(linkedinData.email);

            if (userDoc.linkedin_id && userDoc.linkedin_id !== linkedinData.linkedin_id) {
                throw new Error("Incorrect google id");
            }
            if (!userDoc.linkedin_id) {
                set.linkedin_id =  linkedinData.linkedin_id;
            }

        }
        else {
            errors.throwError('There was a problem with your linkedin identity', 400);
        }

    }


    if(userDoc){
        let response = {
            _id:userDoc._id,
            email: userDoc.email,
            type:userDoc.type
        }
        if(companyDoc) {
            response.company_id = companyDoc._id;
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