const CandidateProfile = require('../../../../../model/candidate_profile');
const User = require('../../../../../model/users');

///// for candidate resume(blockchain) wizard ///////////////////

module.exports = async function (req, res) {

    const myUserDoc = req.auth.user;

    const candidateDoc = await CandidateProfile.findOne({ _creator: myUserDoc._id }).lean();

    const userParam = req.body;
    let candidateUpdate = {}
    if (userParam.why_work) candidateUpdate.why_work = userParam.why_work;
    if (userParam.commercial_experience_year) candidateUpdate.commercial_platform = userParam.commercial_experience_year;
    if (userParam.experimented_platform) candidateUpdate.experimented_platform = userParam.experimented_platform;
    if (userParam.platforms) candidateUpdate.platforms = userParam.platforms;


    await CandidateProfile.update({ _id: candidateDoc._id },{ $set: candidateUpdate });

    let updateCandidateUser = {}

    if(userParam.commercial_skills) updateCandidateUser.candidate.blockchain.commercial_skills = userParam.commercial_skills;
    if(userParam.formal_skills) updateCandidateUser.candidate.blockchain.formal_skills = userParam.formal_skills;

    if (userParam.commercial_skills || userParam.formal_skills) {
        await User.update({ _id: myUserDoc._id },{ $set: updateCandidateUser });
    }

    res.send({
        success: true
    });

};
