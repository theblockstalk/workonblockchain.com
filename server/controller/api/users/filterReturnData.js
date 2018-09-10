module.exports.removeSensativeData = function removeSensativeData(userDoc) {

    delete userDoc._creator.password_hash;
    delete userDoc._creator.salt;
    delete userDoc._creator.jwt_token;
    delete userDoc._creator.verify_email_key;
    delete userDoc._creator.forgot_password_key;
   
    return userDoc;
};


const anonymosCandidateFields = ['image', 'locations', 'roles', 'expected_salary_currency', 'expected_salary', 'interest_area',
    'availability_day', 'why_work', 'commercial_platform', 'experimented_platform', 'platforms', 'current_currency',
    'current_salary', 'programming_languages', 'education_history', 'work_history', 'description', '_creator','nationality'];

module.exports.anonymousSearchCandidateData = function anonymousSearchCandidateData(candidateDoc) {
	const initials = createInitials(candidateDoc.first_name, candidateDoc.last_name);
    candidateDoc = filterWhiteListFields(candidateDoc, anonymosCandidateFields);
    candidateDoc.work_history = candidateDoc.work_history.map((work) => {
        delete work.companyname;
        return work;
    });
    candidateDoc.initials = initials;
    delete candidateDoc.first_name;
	delete candidateDoc.last_name;
	delete candidateDoc.github_account;
	delete candidateDoc.stackexchange_account;
	delete candidateDoc._creator.email;
   
    return candidateDoc;
};

const anonymosCompanyFields = ['company_name', 'company_website', 'company_country', 'company_city','company_description',
		'company_logo', 'company_funded','no_of_employees','company_founded','company_postcode','company_phone','job_title','_creator'];

module.exports.anonymousCandidateData = function anonymousCandidateData(companyDoc) {
    companyDoc = filterWhiteListFields(companyDoc, anonymosCompanyFields);
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