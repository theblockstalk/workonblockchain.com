const CandidateProfile = require('../../../../../model/candidate_profile');
const errors = require('../../../../services/errors');

///// for prefill the candidate profile data ///////////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const candidateDoc = await CandidateProfile.findOne({ _creator: userId }).lean();
    if(candidateDoc) {
        const userParam = req.body;
        let candidateUpdate = {}
        if (userParam.basics.first_name) candidateUpdate.first_name = userParam.basics.first_name;
        if (userParam.basics.last_name) candidateUpdate.last_name = userParam.basics.last_name;
        if (userParam.educationHistory) candidateUpdate.education_history = userParam.educationHistory;
        if (userParam.workHistory) candidateUpdate.work_history = userParam.workHistory;
        if (userParam.basics.summary) candidateUpdate.description = userParam.basics.summary;

        await CandidateProfile.update({ _id: candidateDoc._id },{ $set: candidateUpdate });

        res.send({
            success: true
        });
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }


};
