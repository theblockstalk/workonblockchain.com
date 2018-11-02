const CandidateProfile = require('../../../../../model/candidate_profile');
const User = require('../../../../../model/users');
const welcomeEmail = require('../../../../services/email/emails/welcomeEmail');

///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;
    //getting user info
    const userDoc = req.auth.user;

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

    //sending email for social register
    if(userDoc.social_type === 'GOOGLE' || userDoc.social_type === 'LINKEDIN'){
        let data = {fname : userParam.first_name , email : userDoc.email}
        welcomeEmail.sendEmail(data, userDoc.disable_account);
    }

    res.send({
        success: true
    });
};
