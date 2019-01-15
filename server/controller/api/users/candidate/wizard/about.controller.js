const User = require('../../../../../model/mongoose/users');
const referral = require('../../../../../model/mongoose/referral');
const welcomeEmail = require('../../../../services/email/emails/welcomeEmail');
const verify_send_email = require('../../auth/verify_send_email');
const jwtToken = require('../../../../services/jwtToken');
const errors = require('../../../../services/errors');

const referedCandidateEmail = require('../../../../services/email/emails/youReferredACandidate');
///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {

    const myUserDoc = req.auth.user;

    const candidateUserDoc = await User.findOneById(myUserDoc._id );

    if(candidateUserDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}
        if (queryBody.first_name) candidateUpdate.first_name = queryBody.first_name;
        if (queryBody.last_name) candidateUpdate.last_name = queryBody.last_name;
        if (queryBody.github_account) candidateUpdate['candidate.github_account'] = queryBody.github_account;
        if (queryBody.exchange_account) candidateUpdate['candidate.stackexchange_account'] = queryBody.exchange_account;
        if (queryBody.contact_number) candidateUpdate.contact_number = queryBody.contact_number;
        if (queryBody.nationality) candidateUpdate.nationality = queryBody.nationality;
        if (queryBody.city) candidateUpdate['candidate.base_city'] = queryBody.city;
        if (queryBody.country) candidateUpdate['candidate.base_country'] = queryBody.country;

        await User.update({ _id: candidateUserDoc._id },{ $set: candidateUpdate });

        const refDoc = await referral.findOneByEmail(myUserDoc.referred_email);
        if(refDoc){
            const userDoc = await User.findOneByEmail(refDoc.email);

            if(userDoc && userDoc.type){
                const candidateUserDoc = await User.findOneById(userDoc._id);
                let data;
                if(candidateUserDoc && candidateUserDoc.first_name)
                {
                    data = {
                        fname: candidateUserDoc.first_name,
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
