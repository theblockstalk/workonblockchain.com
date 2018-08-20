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
    filterWhiteListFields(candidateDoc);
    candidateDoc.work_history = candidateDoc.work_history.map((work) => {
        delete work.companyname;
        return work;
    });
    candidateDoc.initials = initials;
    return candidateDoc;
};

const anonymosCandidateFields = ['company_name', 'company_website', 'company_country', 'company_city'];
// TODO: finish

module.exports.anonymousCandidateData = function anonymousCandidateData(companyDoc) {
    filterWhiteListFields(companyDoc);
    companyDoc.initials = initials;
    return companyDoc;
};

function filterWhiteListFields(obj) {
    // TODO: go through each key and delete if not in list anonymosCandidateFields
}

function createInitials(first_name, last_name) {
    // TODO: return initials from names
}