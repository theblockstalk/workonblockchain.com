const User = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const filterReturnData = require('../filterReturnData');

module.exports.update = async function update(candidateUserId, queryBody, educationHistory, workHistory, requestUserId) {
    const candidateDoc = await User.findOneById(candidateUserId);

    let updateCandidateUser = {};
    let unset = {};
    if (queryBody.first_name) updateCandidateUser.first_name = queryBody.first_name;
    if (queryBody.last_name) updateCandidateUser.last_name = queryBody.last_name;
    if (queryBody.github_account) updateCandidateUser['candidate.github_account'] = queryBody.github_account;
    else unset['candidate.github_account'] = 1;

    if (queryBody.exchange_account) updateCandidateUser['candidate.stackexchange_account'] = queryBody.exchange_account;
    else unset['candidate.stackexchange_account'] = 1;

    if (queryBody.contact_number) updateCandidateUser.contact_number = queryBody.contact_number;
    if (queryBody.nationality) updateCandidateUser.nationality = queryBody.nationality;
    if (queryBody.country) updateCandidateUser['candidate.locations'] = queryBody.country;
    if (queryBody.roles) updateCandidateUser['candidate.roles'] = queryBody.roles;
    if (queryBody.interest_areas) updateCandidateUser['candidate.interest_areas'] = queryBody.interest_areas;
    if (queryBody.base_currency) updateCandidateUser['candidate.expected_salary_currency'] = queryBody.base_currency;
    if (queryBody.expected_salary) updateCandidateUser['candidate.expected_salary'] = queryBody.expected_salary;
    if (queryBody.availability_day) updateCandidateUser['candidate.availability_day'] = queryBody.availability_day;
    if (queryBody.why_work) updateCandidateUser['candidate.why_work'] = queryBody.why_work;
    if (queryBody.commercial_platforms && queryBody.commercial_platforms.length > 0) updateCandidateUser['candidate.blockchain.commercial_platforms'] = queryBody.commercial_platforms;
    else unset['candidate.blockchain.commercial_platforms'] = 1;
    if (queryBody.experimented_platforms && queryBody.experimented_platforms.length > 0) updateCandidateUser['candidate.blockchain.experimented_platforms'] = queryBody.experimented_platforms;
    else unset['candidate.blockchain.experimented_platforms'] = 1;
    if (queryBody.smart_contract_platforms && queryBody.smart_contract_platforms.length > 0) updateCandidateUser['candidate.blockchain.smart_contract_platforms'] = queryBody.smart_contract_platforms;
    else unset['candidate.blockchain.smart_contract_platforms'] = 1;
    if (queryBody.salary ) updateCandidateUser['candidate.current_salary'] = queryBody.salary;
    else unset['candidate.current_salary'] = 1;
    if (queryBody.current_currency && queryBody.current_currency !== "-1") updateCandidateUser['candidate.current_currency'] = queryBody.current_currency;
    else unset['candidate.current_currency'] = 1;
    if (queryBody.language_experience_year && queryBody.language_experience_year.length > 0) updateCandidateUser['candidate.programming_languages'] = queryBody.language_experience_year;
    else unset['candidate.programming_languages'] = 1;
    if (queryBody.intro) updateCandidateUser['candidate.description'] = queryBody.intro;
    if (educationHistory && educationHistory.length > 0) updateCandidateUser['candidate.education_history'] = educationHistory;
    else unset['candidate.education_history'] = 1;
    if (workHistory && workHistory.length > 0) updateCandidateUser['candidate.work_history'] = workHistory;
    else unset['candidate.work_history'] = 1;
    if(queryBody.commercial_skills && queryBody.commercial_skills.length >0) updateCandidateUser['candidate.blockchain.commercial_skills'] = queryBody.commercial_skills;
    else unset['candidate.blockchain.commercial_skills'] = 1;
    if(queryBody.formal_skills && queryBody.formal_skills.length > 0 ) updateCandidateUser['candidate.blockchain.formal_skills'] = queryBody.formal_skills;
    else unset['candidate.blockchain.formal_skills'] = 1;
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

    if (!filterReturnData.isEmptyObject(unset)) {
        await User.update({ _id: candidateUserId},{$unset: unset});
    }
}
