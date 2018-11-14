const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');
const errors = require('../../../../services/errors');

module.exports = async function (req,res) {
	let userId = req.auth.user._id;
    const candidateDoc = await CandidateProfile.findOne({ _creator: userId}).lean();

    if(candidateDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}
        if (queryBody.language_exp) candidateUpdate.programming_languages = queryBody.language_exp;
        if (queryBody.education) candidateUpdate.education_history = queryBody.education;
        if (queryBody.work) candidateUpdate.work_history = queryBody.work;
        if (queryBody.detail.intro) candidateUpdate.description = queryBody.detail.intro;

        await CandidateProfile.update({ _id: userId },{ $set: candidateUpdate });
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

}

