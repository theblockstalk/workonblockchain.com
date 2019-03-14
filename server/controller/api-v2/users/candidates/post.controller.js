const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');

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
    let inputBody = req.body;
    let email = inputBody.email;
    let timestamp = new Date();
    let newUserDoc = {};
    newUserDoc.type = 'candidate';
    if(inputBody.referred_email) newUserDoc.referred_email = inputBody.referred_email;
    if(inputBody.google_code) {
        const userData = await candidateHelper.googleAuth(inputBody.google_code);
        if(userData.error) {
            errors.throwError('Something went wrong. Please try again.' , 400)
        }
        else {
            console.log(userData);
            email = userData.email;
            newUserDoc.email = userData.email;
            newUserDoc.google_id = userData.google_id;
            newUserDoc.first_name = userData.first_name;
            newUserDoc.last_name = userData.last_name;
            newUserDoc.is_verify = 1;
            newUserDoc.social_type = 'GOOGLE';
        }
    }
    else if(inputBody.linkedin_code) {

    }
    else {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt);
        hash.update(userParam.password);
        let hashedPasswordAndSalt = hash.digest('hex');
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
    console.log(candidateUserCreated);

}