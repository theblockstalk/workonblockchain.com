const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const regexes = require('../../../../model/regexes');
const crypto = require('../../../services/crypto');
const jwtToken = require('../../../services/jwtToken');
const welcomeEmail = require('../../../services/email/emails/welcomeEmail');
const verifyEmail = require('../../../services/email/emails/verifyEmail');
const users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const google = require('../../../services/google');
const linkedin = require('../../../services/linkedin');
const enumerations = require('../../../../model/enumerations');
const serviceSync = require('../../../services/serviceSync');

module.exports.request = {
    type: 'post',
    path: '/users/candidates'
};

const bodySchema = new Schema({
    email: {
        type:String,
        validate: regexes.email,
        lowercase: true,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
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
    referred_email : {
        type:String,
        validate: regexes.email,
        lowercase: true,
    },
    type:{
        type: String,
        enum: enumerations.userTypes
    }
});

module.exports.inputValidation = {
    body: bodySchema
}


module.exports.endpoint = async function (req, res) {
    let queryBody = req.body;
    let email;
    let timestamp = new Date();
    let newUserDoc = {
        type : 'candidate'
    };
    let userDoc;

    if(queryBody.referred_email) newUserDoc.referred_email = queryBody.referred_email;
    if(queryBody.google_code) {
        const googleData = await google.googleAuth(queryBody.google_code);
        if(googleData) {
            userDoc = await users.findOne({google_id: googleData.google_id});
            if(userDoc) {
                errors.throwError('Google account is already taken' , 400)
            }
            email = googleData.email;
            newUserDoc.email = googleData.email;
            newUserDoc.google_id = googleData.google_id;
            if(googleData.first_name && googleData.first_name !== '') newUserDoc.first_name = googleData.first_name;
            if(googleData.last_name && googleData.last_name !== '') newUserDoc.last_name = googleData.last_name;
            newUserDoc.is_verify = 1;
        }
        else {
            errors.throwError('There was a problem with your google identity' , 404);
        }
    }
    else if(queryBody.linkedin_code) {
        const linkedinData = await linkedin.linkedinAuth(queryBody.linkedin_code);
        if(linkedinData) {
            userDoc = await users.findOne({linkedin_id: linkedinData.linkedin_id});
            if(userDoc) {
                errors.throwError('Linkedin account is already taken' , 400)
            }
            email = linkedinData.email;
            newUserDoc.email = linkedinData.email;
            newUserDoc.linkedin_id = linkedinData.linkedin_id;
            if(linkedinData.first_name && linkedinData.first_name !== '')  newUserDoc.first_name = linkedinData.first_name;
            if(linkedinData.last_name && linkedinData.last_name !== '')  newUserDoc.last_name = linkedinData.last_name;
            newUserDoc.is_verify = 1;
        }
        else {
            errors.throwError('There was a problem with your linkedin identity' , 400)
        }
    }
    else {
        const salt = crypto.getRandomString(128);
        const hashedPasswordAndSalt = crypto.createPasswordHash(queryBody.password, salt);
        email = queryBody.email;
        newUserDoc.email = queryBody.email;
        newUserDoc.first_name = queryBody.first_name;
        newUserDoc.last_name = queryBody.last_name;
        newUserDoc.salt = salt;
        newUserDoc.password_hash = hashedPasswordAndSalt;
    }

    userDoc = await users.findOneByEmail(email);
    if(userDoc) {
        errors.throwError('Email "' + email + '" is already taken' , 400)
    }

    newUserDoc.candidate = {
        history: [{
            status : {
                status: 'created'
            },
            timestamp : timestamp
        }],
        latest_status : {
            status : 'created',
            timestamp : timestamp
        }
    }

    const candidateUserCreated = await users.insert(newUserDoc);

    let updateCandidate = {};
    let signOptions = {
        expiresIn:  "1h",
    };
    let jwtUserToken = jwtToken.createJwtToken(candidateUserCreated);
    let verifyEmailToken = jwtToken.createJwtToken(candidateUserCreated, signOptions);
    updateCandidate['jwt_token'] = jwtUserToken;
    updateCandidate['verify_email_key'] = verifyEmailToken;
    updateCandidate['session_started'] = timestamp;

    await users.update({_id: candidateUserCreated._id}, {$set: updateCandidate});


    if(candidateUserCreated.google_id || candidateUserCreated.linkedin_id) {
        let data = {fname : candidateUserCreated.first_name , email : candidateUserCreated.email};
        welcomeEmail.sendEmail(data, candidateUserCreated.disable_account);
    }
    else {
        verifyEmail.sendEmail(candidateUserCreated.email, candidateUserCreated.first_name, verifyEmailToken);
    }

    await serviceSync.pushToQueue("POST", candidateUserCreated);

    res.send({
        _id: candidateUserCreated._id,
        type:candidateUserCreated.type,
        email: candidateUserCreated.email,
        jwt_token: jwtUserToken
    });


}