const User = require('../../../../model/users');
const errors = require('../../../services/errors');

module.exports.update = async function update(candidateUserId, queryBody, educationHistory, workHistory, requestUserId) {
    const candidateDoc = await User.findOne({ _id: candidateUserId }).lean();

    let updateCandidateUser = {};

    if (queryBody.first_name) updateCandidateUser.first_name = queryBody.first_name;
    if (queryBody.last_name) updateCandidateUser.last_name = queryBody.last_name;
    if (queryBody.github_account) updateCandidateUser['candidate.github_account'] = queryBody.github_account;
    if (queryBody.exchange_account) updateCandidateUser['candidate.stackexchange_account'] = queryBody.exchange_account;
    if (queryBody.contact_number) updateCandidateUser.contact_number = queryBody.contact_number;
    if (queryBody.nationality) updateCandidateUser.nationality = queryBody.nationality;
    if (queryBody.country) updateCandidateUser['candidate.locations'] = queryBody.country;
    if (queryBody.roles) updateCandidateUser['candidate.roles'] = queryBody.roles;
    if (queryBody.interest_areas) updateCandidateUser['candidate.interest_areas'] = queryBody.interest_areas;
    if (queryBody.base_currency) updateCandidateUser['candidate.expected_salary_currency'] = queryBody.base_currency;
    if (queryBody.expected_salary) updateCandidateUser['candidate.expected_salary'] = queryBody.expected_salary;
    if (queryBody.availability_day) updateCandidateUser['candidate.availability_day'] = queryBody.availability_day;
    if (queryBody.why_work) updateCandidateUser['candidate.why_work'] = queryBody.why_work;
    if (queryBody.commercial_platforms) updateCandidateUser['candidate.blockchain.commercial_platforms'] = queryBody.commercial_platforms;
    if (queryBody.experimented_platforms) updateCandidateUser['candidate.blockchain.experimented_platforms'] = queryBody.experimented_platforms;
    if (queryBody.smart_contract_platforms) updateCandidateUser['candidate.blockchain.smart_contract_platforms'] = queryBody.smart_contract_platforms;
    if (queryBody.salary || queryBody.salary === '') updateCandidateUser['candidate.current_salary'] = queryBody.salary;
    if (queryBody.current_currency) updateCandidateUser['candidate.current_currency'] = queryBody.current_currency;
    if (queryBody.language_experience_year) updateCandidateUser['candidate.programming_languages'] = queryBody.language_experience_year;
    if (queryBody.intro) updateCandidateUser['candidate.description'] = queryBody.intro;
    if (educationHistory) updateCandidateUser['candidate.education_history'] = educationHistory;
    if (workHistory) updateCandidateUser['candidate.work_history'] = workHistory;
    if(queryBody.commercial_skills) updateCandidateUser['candidate.blockchain.commercial_skills'] = queryBody.commercial_skills;
    if(queryBody.formal_skills) updateCandidateUser['candidate.blockchain.formal_skills'] = queryBody.formal_skills;
    if(queryBody.city) updateCandidateUser['candidate.base_city'] = queryBody.city;
    if(queryBody.base_country) updateCandidateUser['candidate.base_country'] = queryBody.base_country;

    let status = 'updated';
    if (requestUserId && requestUserId !== candidateUserId) {
        status = 'updated by admin';
    }
    await User.update({ _id: candidateUserId }, {
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
