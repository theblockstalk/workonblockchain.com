const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

module.exports = async function (req,res)
{
	let userId = req.auth.user._id;
    const candidateDoc = await CandidateProfile.findOne({ _creator: userId}).lean();

    if(candidateDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}
        if (queryBody.country) candidateUpdate.locations = queryBody.country;
        if (queryBody.roles) candidateUpdate.roles = queryBody.roles;
        if (queryBody.interest_area) candidateUpdate.interest_area = queryBody.interest_area;
        if (queryBody.base_currency) candidateUpdate.expected_salary_currency = queryBody.base_currency;
        if (queryBody.expected_salary) candidateUpdate.expected_salary = queryBody.expected_salary;
        if (queryBody.availability_day) candidateUpdate.availability_day = queryBody.availability_day;
        if (queryBody.current_salary) candidateUpdate.current_salary = queryBody.current_salary;
        if (queryBody.current_currency) candidateUpdate.current_currency = queryBody.current_currency;

        await CandidateProfile.update({ _id: userId },{ $set: candidateUpdate });
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }
}

