module.exports.removeSensativeData = function removeSensativeData(userDoc) {
    delete userDoc.password_hash;
    delete userDoc.salt;
    delete userDoc.jwt_token;
    delete userDoc.verify_email_key;
    delete userDoc.forgot_password_key;
    return userDoc;
};

const anonymosCandidateFields = ['image', 'location', 'roles', 'expected_salary_currency', 'expected_salary', 'interest_area',
    'availability_day', 'why_work', 'commercial_platform', 'experimented_platform', 'platforms', 'current_currency',
    'current_salary', 'programming_languages', 'education_history', 'work_history', 'description', '_creator'];

module.exports.anonymousCandidateData = function anonymousCandidateData(candidateDoc) {
    const initials = createInitials(candidateDoc.first_name, candidateDoc.last_name);
    filterWhiteListFields(candidateDoc, anonymosCandidateFields);
    candidateDoc.work_history = candidateDoc.work_history.map((work) => {
        delete work.companyname;
        return work;
    });
    candidateDoc.initials = initials;
    return candidateDoc;
};

const anonymosCompanyFields = ['company_name', 'company_website', 'company_country', 'company_city'];
// TODO: finish

module.exports.anonymousCandidateData = function anonymousCandidateData(companyDoc) {
    filterWhiteListFields(companyDoc, anonymosCompanyFields);
    return companyDoc;
};

function filterWhiteListFields(obj, whitelist) {
    let filteredObj = {};
    for (let key in obj) {
        if (whitelist.includes(key)) {
            filteredObj[key] = obj[key];
        }
    }
    return filteredObj;
}

function createInitials(first_name, last_name) {
    return first_name.charAt(0).toUpperCase() + last_name.charAt(0).toUpperCase();
}