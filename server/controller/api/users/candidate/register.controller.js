const settings = require('../../../../settings');
var _ = require('lodash');
const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwtToken = require('../../../services/jwtToken');
const referral = require('../../../../model/referrals');
const errors = require('../../../services/errors');

///////to create new candidate////////////////////////////

module.exports = async function (req, res) {

    let userParam = req.body;

    if(userParam.linkedin_id) {
        const candidateUserDoc = await User.findOne({ linkedin_id: userParam.linkedin_id }).lean();
        if (candidateUserDoc) {
            let errorMsg = 'Email "' + userParam.email + '" is already taken';
            errors.throwError(errorMsg , 400)
        }
    }

    const userDoc = await User.findOne({ email: userParam.email }).lean();
    console.log(userDoc);
    if (userDoc )
    {
        let errorMsg = 'Email "' + userParam.email + '" is already taken';
        errors.throwError(errorMsg , 400)
    }

    let is_verify=0;
    if(userParam.social_type === 'GOOGLE' || userParam.social_type === 'LINKEDIN')
    {
        is_verify = 1;
    }

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt);
    hash.update(userParam.password);
    let hashedPasswordAndSalt = hash.digest('hex');

    let newUser = new User
    ({
        email: userParam.email,
        password_hash: hashedPasswordAndSalt,
        salt : salt,
        type: userParam.type,
        social_type: userParam.social_type,
        is_verify:is_verify,
        created_date: new Date(),
        referred_email : userParam.referred_email,
        linkedin_id : userParam.linkedin_id
    });

    const candidateUserCreated = await newUser.save();
    let url_token;

    if(candidateUserCreated) {
        let jwtUserToken = jwtToken.createJwtToken(candidateUserCreated);
        await User.update({_id: candidateUserCreated._id}, {$set: {'jwt_token': jwtUserToken}});
        let info = new CandidateProfile
        ({
            _creator : candidateUserCreated._id
        });
        const candidateUserDoc = await info.save();

        const referralDoc = referral.findOne({ email: userParam.email }).lean();
        if(referralDoc) {
            url_token = referralDoc.url_token;
        }
        else {
            let new_salt = crypto.randomBytes(16).toString('base64');
            let new_hash = crypto.createHmac('sha512', new_salt);
            url_token = new_hash.digest('hex');
            url_token = url_token.substr(url_token.length - 10); //getting last 10 characters
            let document = new referral
            ({
                email : userParam.email,
                url_token : url_token,
                date_created: new Date(),
            });
            await document.save();
        }

        res.send
        ({
            _id:candidateUserDoc.id,
            _creator: candidateUserCreated._id,
            type:candidateUserCreated.type,
            email: candidateUserCreated.email,
            ref_link: url_token,
            is_approved : candidateUserCreated.is_approved,
            jwt_token: jwtUserToken
        });

    }



}

