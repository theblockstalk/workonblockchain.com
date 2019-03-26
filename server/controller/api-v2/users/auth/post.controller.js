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
const objects = require('../../../services/objects');
const logger = require('../../../services/logger');


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
        if(userDoc && userDoc.password_hash) {
            let hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.password, userDoc.salt)
            if (hashedPasswordAndSalt === userDoc.password_hash) {
                if(userDoc.type === 'company') {
                    companyDoc = await companies.findOne({ _creator:  userDoc._id });
                }
            }
            else {
                errors.throwError("Incorrect Password" , 400)
            }
        }
        else {
            errors.throwError("Incorrect Password" , 400)
        }
    }
    if(queryBody.google_code)
    {
        const googleData = await google.googleAuth(queryBody.google_code);
        if (googleData) {
            userDoc = await users.findOneByEmail(googleData.email);

            if (userDoc.google_id && userDoc.google_id !== googleData.google_id) {
                throw new Error("Incorrect google id");
            }
            if (!userDoc.google_id) {
                const userGoogleDoc = await users.findOne({google_id: googleData.google_id});
                if(userGoogleDoc) {
                    logger.error('A user with email has try to signin with duplicate google account', googleData);
                    errors.throwError('This Google account is already linked to another user. Please contact us to resolve.' , 400)
                }
                set.google_id =  googleData.google_id;
            }

        }
        else {
            errors.throwError('There was a problem with your google identity', 400);
        }

    }
    if(queryBody.linkedin_code) {
        const linkedinData = await linkedin.linkedinAuth(queryBody.linkedin_code);
        if (linkedinData) {
            userDoc = await users.findOneByEmail(linkedinData.email);

            if (userDoc.linkedin_id && userDoc.linkedin_id !== linkedinData.linkedin_id) {
                throw new Error("Incorrect google id");
            }
            if (!userDoc.linkedin_id) {
                const userLinkedinDoc = await users.findOne({linkedin_id: linkedinData.linkedin_id});
                if(userLinkedinDoc) {
                    logger.error('A user with email has try to signin with duplicate linkedin account', linkedinData);
                    errors.throwError('This Linkedin account is already linked to another user. Please contact us to resolve.' , 400)
                }
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