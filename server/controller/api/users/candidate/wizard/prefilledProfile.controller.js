const CandidateProfile = require('../../../../../model/candidate_profile');

///// for prefill the candidate profile data ///////////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const candidateDoc = await CandidateProfile.findOne({ _creator: userId }).lean();

    const userParam = req.body;
    const candidateUpdate = {
        first_name: userParam.basics.first_name,
        last_name: userParam.basics.last_name,
        // @sadia Phone number also?
        education_history: userParam.educationHistory,
        work_history: userParam.workHistory,
        description: userParam.basics.summary
    };

    await CandidateProfile.update({ _id: candidateDoc._id },{ $set: candidateUpdate });

    res.send({
        success: true
    });
};
