const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const crypto = require('crypto');
const jwtToken = require('../../../services/jwtToken');
const welcomeEmail = require('../../../services/email/emails/welcomeEmail');
const verifyEmail = require('../../../services/email/emails/verifyEmail');
const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../../../api/users/filterReturnData');
const objects = require('../../../services/objects');
const errors = require('../../../services/errors');
const candidateHelper = require('./candidateHelper');


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
    },
    type: {
        type:String,
        enum: ['candidate', 'company'],
    },
    social_type: {
        type:String,
        enum: ['GOOGLE', 'LINKEDIN', '']
    },
    referred_email : {
        type:String
    },
});

module.exports.inputValidation = {
    body: bodySchema
}


module.exports.endpoint = async function (req, res) {
    console.log(req.body);
    let queryBody = req.body;
    let email;
    let timestamp = new Date();
    let newUserDoc = {};
    newUserDoc.type = 'candidate';

    if(queryBody.email) email = queryBody.email;
    if(queryBody.referred_email) newUserDoc.referred_email = queryBody.referred_email;
    if(queryBody.google_code) {
        const googleData = await candidateHelper.googleAuth(queryBody.google_code);
        if(googleData) {
            email = googleData.email;
            newUserDoc.email = googleData.email;
            newUserDoc.google_id = googleData.google_id;
            newUserDoc.first_name = googleData.first_name;
            newUserDoc.last_name = googleData.last_name;
            newUserDoc.is_verify = 1;
            newUserDoc.social_type = 'GOOGLE';
        }
        else {
            errors.throwError('Something went wrong. Please try again.' , 400);
        }
    }
    else if(queryBody.linkedin_code) {
        const linkedinData = await candidateHelper.linkedinAuth(queryBody.linkedin_code);
        if(linkedinData) {
            email = linkedinData.email;
            newUserDoc.email = linkedinData.email;
            newUserDoc.linkedin_id = linkedinData.linkedin_id;
            newUserDoc.first_name = linkedinData.first_name;
            newUserDoc.last_name = linkedinData.last_name;
            newUserDoc.is_verify = 1;
            newUserDoc.social_type = 'LINKEDIN';
        }
        else {
            errors.throwError('Something went wrong. Please try again.' , 400)
        }
    }
    else {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt);
        hash.update(queryBody.password);
        let hashedPasswordAndSalt = hash.digest('hex');
        newUserDoc.email = queryBody.email;
        newUserDoc.first_name = queryBody.first_name;
        newUserDoc.last_name = queryBody.last_name;
        newUserDoc.salt = salt;
        newUserDoc.password_hash = hashedPasswordAndSalt;
    }

    const userDoc = await users.findOneByEmail(email);
    if (userDoc )
    {
        let errorMsg = 'Email "' + email + '" is already taken';
        errors.throwError(errorMsg , 400)
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

    await users.update({_id: candidateUserCreated._id}, {$set: updateCandidate});


    if(candidateUserCreated.social_type === 'GOOGLE' || candidateUserCreated.social_type === 'LINKEDIN'){
        let data = {fname : candidateUserCreated.first_name , email : candidateUserCreated.email};
        welcomeEmail.sendEmail(data, candidateUserCreated.disable_account);
    }
    else {
        verifyEmail.sendEmail(candidateUserCreated.email, candidateUserCreated.first_name, verifyEmailToken);
    }

    res.send
    ({
        _id: candidateUserCreated._id,
        _creator : candidateUserCreated._id,
        type:candidateUserCreated.type,
        email: candidateUserCreated.email,
        jwt_token: jwtUserToken
    });


}