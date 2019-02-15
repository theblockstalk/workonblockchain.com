const users = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');

///// for prefill the candidate profile data ///////////////////

module.exports = async function (req, res) {

    const userId = req.auth.user._id;
    const candidateUserDoc = await users.findOneById(userId);

    if(candidateUserDoc) {
        const userParam = req.body;
        let candidateUpdate = {}
        if (userParam.educationHistory) candidateUpdate['candidate.education_history'] = userParam.educationHistory;
        if (userParam.workHistory) candidateUpdate['candidate.work_history'] = userParam.workHistory;
        if (userParam.basics.summary) candidateUpdate['candidate.description'] = userParam.basics.summary;

        await users.update({ _id: userId },{ $set: candidateUpdate });

        res.send({
            success: true
        });
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

};
