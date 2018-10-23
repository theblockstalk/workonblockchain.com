const CandidateProfile = require('../../../../../model/candidate_profile');
const User = require('../../../../../model/users');

///// for prefill the candidate profile data ///////////////////

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

    const userDoc = await User.findOne({ _id: userId }).lean();

    let userUpdate={};
    if (userParam.country && userParam.city)
        userUpdate.candidate = {base_city : userParam.city , base_country : userParam.country };

    await User.update({ _id: userDoc._id },{ $set: userUpdate });

    res.send({
        success: true
    });
};
