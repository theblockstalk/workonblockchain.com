const CandidateProfile = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');
const errors = require('../../../services/errors');

module.exports.update = async function update(candidateUserId, queryBody, educationHistory, workHistory, requestUserId) {
    const candidateDoc = await CandidateProfile.findOne({ _creator: candidateUserId }).lean();

    let candidateUpdate = {};

    if (queryBody.first_name) candidateUpdate.first_name = queryBody.first_name;
    if (queryBody.last_name) candidateUpdate.last_name = queryBody.last_name;
    if (queryBody.github_account) candidateUpdate.github_account = queryBody.github_account;
    if (queryBody.exchange_account) candidateUpdate.stackexchange_account = queryBody.exchange_account;
    if (queryBody.contact_number) candidateUpdate.contact_number = queryBody.contact_number;
    if (queryBody.nationality) candidateUpdate.nationality = queryBody.nationality;
    if (queryBody.country) candidateUpdate.locations = queryBody.country;
    if (queryBody.roles) candidateUpdate.roles = queryBody.roles;
    if (queryBody.interest_area) candidateUpdate.interest_area = queryBody.interest_area;
    if (queryBody.base_currency) candidateUpdate.expected_salary_currency = queryBody.base_currency;
    if (queryBody.expected_salary) candidateUpdate.expected_salary = queryBody.expected_salary;
    if (queryBody.availability_day) candidateUpdate.availability_day = queryBody.availability_day;
    if (queryBody.why_work) candidateUpdate.why_work = queryBody.why_work;
    if (queryBody.commercial_experience_year) candidateUpdate.commercial_platform = queryBody.commercial_experience_year;
    if (queryBody.experimented_platform) candidateUpdate.experimented_platform = queryBody.experimented_platform;
    if (queryBody.salary) candidateUpdate.current_salary = queryBody.salary;
    if (queryBody.current_currency) candidateUpdate.current_currency = queryBody.current_currency;
    if (queryBody.language_experience_year) candidateUpdate.programming_languages = queryBody.language_experience_year;
    if (queryBody.intro) candidateUpdate.description = queryBody.intro;
    if (educationHistory) candidateUpdate.education_history = educationHistory;
    if (workHistory) candidateUpdate.work_history = workHistory;

    await CandidateProfile.update({ _id: candidateDoc._id },{ $set: candidateUpdate });

    let updateCandidateUser = {};

    if(queryBody.commercial_skills) updateCandidateUser["candidate.blockchain.commercial_skills"] = queryBody.commercial_skills;
    if(queryBody.formal_skills) updateCandidateUser["candidate.blockchain.formal_skills"] = queryBody.formal_skills;

    if(queryBody.city) updateCandidateUser["candidate.base_city"] = queryBody.city;
    if(queryBody.base_country) updateCandidateUser["candidate.base_country"] = queryBody.base_country;

    let status = 'updated';
    if (requestUserId && requestUserId !== candidateUserId) {
        status = 'updated by admin';
    }
    await User.update({ _id: candidateUserId },
        {
            $set: updateCandidateUser,
            $push: {
                'candidate.status' : {
                    $each: [{ status: status,
                        timestamp: new Date()}],
                    $position: 0
                }
            }
        }
    );
}
