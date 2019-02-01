const Messages = require('../../../model/messages');

const removeSensativeData = module.exports.removeSensativeData = function removeSensativeData(userDoc,sendOptions)
{
    if(userDoc)
	{
		delete userDoc.password_hash;
	    delete userDoc.salt;
        if(!sendOptions) sendOptions={};
        if (!sendOptions.jwt_token) delete userDoc.jwt_token;
        if (!sendOptions.verify_email_key )delete userDoc.verify_email_key;
        if (!sendOptions.forgot_password_key) delete userDoc.forgot_password_key;
	}

    return userDoc;
};

const anonymosUserFields = ['candidate', 'image', 'initials', 'nationality', '_id', 'is_verify', 'disable_account' , 'type', 'email'];

const anonymosCandidateFields = ['locations', 'roles', 'expected_salary_currency', 'expected_salary', 'interest_areas',
    'availability_day', 'why_work', 'commercial_platforms', 'blockchain', 'experimented_platforms', 'smart_contract_platforms' , 'commercial_skills',
    'formal_skills' , 'current_currency', 'current_salary', 'programming_languages', 'education_history', 'work_history', 'description',
    'nationality' , 'status'];

const anonymousSearchCandidateData = module.exports.anonymousSearchCandidateData = function anonymousSearchCandidateData(userDoc) {

    if(userDoc.first_name && userDoc.last_name)
    {
        const initials = createInitials(userDoc.first_name, userDoc.last_name);
        userDoc.initials = initials;
    }

    userDoc = filterWhiteListFields(userDoc, anonymosUserFields);

    if (userDoc.candidate) {
        if (userDoc.candidate.work_history) {
            userDoc.candidate.work_history = userDoc.candidate.work_history.map((work) => {
                delete work.companyname;
            return work;
        });
        }
        userDoc.candidate = filterWhiteListFields(userDoc.candidate, anonymosCandidateFields);
    }

    return userDoc;
};

const anonymosCompanyFields = ['company_name', 'company_website', 'company_country', 'company_city','company_description',
		'company_logo', 'company_funded','no_of_employees','company_founded','company_postcode','company_phone','job_title', '_creator'];

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

const createInitials = module.exports.createInitials = function createInitials(first_name, last_name) {
    return first_name.charAt(0).toUpperCase() + last_name.charAt(0).toUpperCase();
}



module.exports.candidateAsCompany = async function candidateAsCompany(candidateDoc, companyId) {
    const acceptedJobOffer = await Messages.find({sender_id: candidateDoc._id, receiver_id: companyId, msg_tag: 'job_offer_accepted'})
    if (acceptedJobOffer && acceptedJobOffer.length>0)
        return removeSensativeData(candidateDoc);
    else
        return anonymousSearchCandidateData(candidateDoc);

};

const isEmptyObject = module.exports.isEmptyObject = function isEmptyObject(obj) {
    for(let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}