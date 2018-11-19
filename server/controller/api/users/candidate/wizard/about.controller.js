const CandidateProfile = require('../../../../../model/candidate_profile');
const User = require('../../../../../model/users');
const referral = require('../../../../../model/referrals');
const welcomeEmail = require('../../../../services/email/emails/welcomeEmail');
const verify_send_email = require('../../auth/verify_send_email');
const jwtToken = require('../../../../services/jwtToken');
const errors = require('../../../../services/errors');

const referedCandidateEmail = require('../../../../services/email/emails/youReferredACandidate');
///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {

    const myUserDoc = req.auth.user;

    const candidateDoc = await CandidateProfile.findOne({ _creator: myUserDoc._id }).lean();

    if(candidateDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}
        if (queryBody.first_name) candidateUpdate.first_name = queryBody.first_name;
        if (queryBody.last_name) candidateUpdate.last_name = queryBody.last_name;
        if (queryBody.github_account) candidateUpdate.github_account = queryBody.github_account;
        if (queryBody.exchange_account) candidateUpdate.stackexchange_account = queryBody.exchange_account;
        if (queryBody.contact_number) candidateUpdate.contact_number = queryBody.contact_number;
        if (queryBody.nationality) candidateUpdate.nationality = queryBody.nationality;

        await CandidateProfile.update({ _id: candidateDoc._id },{ $set: candidateUpdate });

        if (queryBody.country && queryBody.city) {
            await User.update({ _id: myUserDoc._id },{ $set: {'candidate.base_city' : queryBody.city , 'candidate.base_country' : queryBody.country } });
        }

        const refDoc = await referral.findOne({
            email : myUserDoc.referred_email
        }).lean();
        if(refDoc){
            const userDoc = await User.findOne({email : refDoc.email}).lean();

            if(userDoc && userDoc.type){
                const candidateDoc = await CandidateProfile.findOne({_creator : userDoc._id}).lean();
                let data;
                if(candidateDoc && candidateDoc.first_name)
                {
                    data = {
                        fname: candidateDoc.first_name,
                        email : refDoc.email,
                        referred_fname: queryBody.first_name,
                        referred_lname: queryBody.last_name
                    };
                }
                else
                {
                    data = {
                        email : refDoc.email,
                        referred_fname : queryBody.first_name,
                        referred_lname: queryBody.last_name
                    };
                }
                referedCandidateEmail.sendEmail(data, userDoc.disable_account);
            }
            else {
                let data = {
                    email: refDoc.email,
                    referred_fname: queryBody.first_name,
                    referred_lname: queryBody.last_name
                };
                referedCandidateEmail.sendEmail(data, false);
            }

        }
        //sending email for social register
        if(myUserDoc.social_type === 'GOOGLE' || myUserDoc.social_type === 'LINKEDIN'){
            let data = {fname : queryBody.first_name , email : myUserDoc.email}
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

    }
    else {
        errors.throwError("Candidate account not found", 404);
    }


};
