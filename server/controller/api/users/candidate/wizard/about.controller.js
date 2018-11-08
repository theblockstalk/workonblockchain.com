const CandidateProfile = require('../../../../../model/candidate_profile');
const User = require('../../../../../model/users');
const referral = require('../../../../../model/referrals');
const EmployerProfile = require('../../../../../model/employer_profile');
const welcomeEmail = require('../../../../services/email/emails/welcomeEmail');
const verify_send_email = require('../../auth/verify_send_email');
const jwtToken = require('../../../../services/jwtToken');

const referedCandidateEmail = require('../../../../services/email/emails/referredFriend');
const referedCompanyEmail = require('../../../../services/email/emails/referredFriendForCompany');
///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {

    const myUserDoc = req.auth.user;

    const candidateDoc = await CandidateProfile.findOne({ _creator: myUserDoc._id }).lean();

    const userParam = req.body;
    let candidateUpdate = {}
    if (userParam.first_name) candidateUpdate.first_name = userParam.first_name;
    if (userParam.last_name) candidateUpdate.last_name = userParam.last_name;
    if (userParam.github_account) candidateUpdate.github_account = userParam.github_account;
    if (userParam.exchange_account) candidateUpdate.stackexchange_account = userParam.exchange_account;
    if (userParam.contact_number) candidateUpdate.contact_number = userParam.contact_number;
    if (userParam.nationality) candidateUpdate.nationality = userParam.nationality;

    await CandidateProfile.update({ _id: candidateDoc._id },{ $set: candidateUpdate });

    if (userParam.country && userParam.city) {
        await User.update({ _id: myUserDoc._id },{ $set: {'candidate.base_city' : userParam.city , 'candidate.base_country' : userParam.country } });
    }

    const refDoc = await referral.findOne({
        email : myUserDoc.referred_email
    }).lean();
    if(refDoc){
        const userDoc = await User.findOne({email : refDoc.email}).lean();

        if(userDoc && userDoc.type){
                const candidateDoc = await CandidateProfile.findOne({_creator : userDoc._id}).lean();
                let data = {};
                if(candidateDoc && candidateDoc.first_name)
                {
                    data = {fname : candidateDoc.first_name , email : refDoc.email , referred_fname : userParam.first_name , referred_lname: userParam.last_name }
                }
                else
                {
                     data = {fname : null , email : refDoc.email , referred_fname : userParam.first_name , referred_lname: userParam.last_name }
                }
                referedCandidateEmail.sendEmail(data, userDoc.disable_account);
        }
        else
        {
            let data = {email : refDoc.email , referred_fname : userParam.first_name , referred_lname: userParam.last_name }
            referedCandidateEmail.sendEmail(data, false);
        }

    }
    //sending email for social register
    if(myUserDoc.social_type === 'GOOGLE' || myUserDoc.social_type === 'LINKEDIN'){
        let data = {fname : userParam.first_name , email : myUserDoc.email}
        welcomeEmail.sendEmail(data, myUserDoc.disable_account);
    }
    else {
        let signOptions = {
            expiresIn:  "1h",
        };
        let verifyEmailToken = jwtToken.createJwtToken(myUserDoc, signOptions);
        var set =
            {
                verify_email_key: verifyEmailToken,

            };
        await User.update({ _id: myUserDoc._id },{ $set: set });
        verify_send_email(myUserDoc.email, verifyEmailToken);


    }

    res.send({
        success: true
    });

};
