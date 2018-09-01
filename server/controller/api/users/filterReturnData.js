module.exports.removeSensativeData = function removeSensativeData(userDoc) {
	console.log("userDoc");
	
    delete userDoc._creator.password_hash;
    delete userDoc._creator.salt;
    delete userDoc._creator.jwt_token;
    delete userDoc._creator.verify_email_key;
    delete userDoc._creator.forgot_password_key;
   
    return userDoc;
};

const anonymosCandidateFields = ['image', 'location', 'roles', 'expected_salary_currency', 'expected_salary', 'interest_area',
    'availability_day', 'why_work', 'commercial_platform', 'experimented_platform', 'platforms', 'current_currency',
    'current_salary', 'programming_languages', 'education_history', 'work_history', 'description', '_creator'];

module.exports.anonymousSearchCandidateData = function anonymousSearchCandidateData(candidateDoc) {
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