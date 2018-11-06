const CandidateProfile = require('../../../../model/candidate_profile');
const User = require('../../../../model/users');

///// for candidate about wizard ///////////////////

module.exports = async function (req, res) {
    const userId = req.auth.user._id;

    const candidateDoc = await CandidateProfile.findOne({ _creator: userId }).lean();

    const userParam = req.body.detail;
    const historyParam = req.body;
    let candidateUpdate = {}

    if (userParam.first_name) candidateUpdate.first_name = userParam.first_name;
    if (userParam.last_name) candidateUpdate.last_name = userParam.last_name;
    if (userParam.github_account) candidateUpdate.github_account = userParam.github_account;
    if (userParam.exchange_account) candidateUpdate.stackexchange_account = userParam.exchange_account;
    if (userParam.contact_number) candidateUpdate.contact_number = userParam.contact_number;
    if (userParam.country) candidateUpdate.locations = userParam.country;
    if (userParam.roles) candidateUpdate.roles = userParam.roles;
    if (userParam.interest_area) candidateUpdate.interest_area = userParam.interest_area;
    if (userParam.base_currency) candidateUpdate.expected_salary_currency = userParam.base_currency;
    if (userParam.expected_salary) candidateUpdate.expected_salary = userParam.expected_salary;
    if (userParam.availability_day) candidateUpdate.availability_day = userParam.availability_day;
    if (userParam.why_work) candidateUpdate.why_work = userParam.why_work;
    if (userParam.commercial_experience_year) candidateUpdate.commercial_platform = userParam.commercial_experience_year;
    if (userParam.experimented_platform) candidateUpdate.experimented_platform = userParam.experimented_platform;
    if (userParam.salary) candidateUpdate.current_salary = userParam.salary;
    if (userParam.current_currency) candidateUpdate.current_currency = userParam.current_currency;
    if (userParam.language_experience_year) candidateUpdate.programming_languages = userParam.language_experience_year;
    if (userParam.intro) candidateUpdate.description = userParam.intro;
    if (historyParam.education) candidateUpdate.education_history = historyParam.education;
    if (historyParam.work) candidateUpdate.work_history = historyParam.work;

    await CandidateProfile.update({ _id: candidateDoc._id },{ $set: candidateUpdate });

    if (userParam.base_country && userParam.city) {
        await User.update({ _id: userId },{ $set: {'candidate.base_city' : userParam.city , 'candidate.base_country' : userParam.base_country } });
    }

    let updateCandidateUser = {}

    if(userParam.commercial_skills || userParam.formal_skills)
    {
        updateCandidateUser = {
            candidate: {
                blockchain: {}
            }
        }
        if(userParam.commercial_skills ) updateCandidateUser.candidate.blockchain.commercial_skills = userParam.commercial_skills;
        if(userParam.formal_skills)  updateCandidateUser.candidate.blockchain.formal_skills = userParam.formal_skills;
    }

    if(userParam.city) updateCandidateUser.candidate.base_city = userParam.city;
    if(userParam.base_country) updateCandidateUser.candidate.base_country = userParam.base_country;
    if (updateCandidateUser) {
        await User.update({ _id: userId },{ $set: updateCandidateUser });
    }


    res.send({
        success: true,
    });
};
