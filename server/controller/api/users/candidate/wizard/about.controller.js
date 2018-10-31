const CandidateProfile = require('../../../../../model/candidate_profile');
const User = require('../../../../../model/users');
const referral = require('../../../../../model/referrals');
const EmployerProfile = require('../../../../../model/employer_profile');

const referedUserEmail = require('../../../../services/email/emails/referredFriend');
///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const candidateDoc = await CandidateProfile.findOne({ _creator: userId }).lean();

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
        await User.update({ _id: userId },{ $set: {'candidate.base_city' : userParam.city , 'candidate.base_country' : userParam.country } });
    }

        const refDoc = await referral.findOne({
            _id : userParam.referred_id
        }).lean();
        if(refDoc){

            const userDoc = await User.findOne({email : refDoc.email}).lean();

            if(userDoc && userDoc.type){
                if(userDoc.type === 'candidate'){
                    const candidateDoc = await CandidateProfile.findOne({_creator : userDoc._id}).lean();
                    let data = {fname : candidateDoc.first_name , email : refDoc.email , referred_fname : userParam.first_name , referred_lname: userParam.last_name }
                    referedUserEmail.sendEmail(data, userDoc.disable_account);
                }
                if(userDoc.type === 'company'){
                    const companyDoc = await EmployerProfile.findOne({_creator : userDoc._id}).lean();
                    let data = {fname : companyDoc.first_name , email : refDoc.email , referred_fname : userParam.first_name , referred_lname: userParam.last_name }
                    referedUserEmail.sendEmail(data, userDoc.disable_account);
                }
            }
            else
            {
                let data = {email : refDoc.email , referred_fname : userParam.first_name , referred_lname: userParam.last_name }
                referedUserEmail.sendEmail(data, false);
            }

        }

    res.send({
        success: true
    });

};
