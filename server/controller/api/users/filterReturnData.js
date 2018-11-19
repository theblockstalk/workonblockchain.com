const Chat = require('../../../model/chat');

const removeSensativeData = module.exports.removeSensativeData = function removeSensativeData(userDoc,sendOptions)
{
    if(userDoc._creator)
	{
		delete userDoc._creator.password_hash;
	    delete userDoc._creator.salt;
        if(!sendOptions) sendOptions={};
        if (!sendOptions.jwt_token) delete userDoc._creator.jwt_token;
        if (!sendOptions.verify_email_key )delete userDoc._creator.verify_email_key;
        if (!sendOptions.forgot_password_key) delete userDoc._creator.forgot_password_key;
	}

    return userDoc;
};


const anonymosCandidateFields = ['image', 'locations', 'roles', 'expected_salary_currency', 'expected_salary', 'interest_area',
    'availability_day', 'why_work', 'commercial_platform', 'experimented_platform', 'platforms', 'current_currency',
    'current_salary', 'programming_languages', 'education_history', 'work_history', 'description', '_creator','nationality'];

const anonymousSearchCandidateData = module.exports.anonymousSearchCandidateData = function anonymousSearchCandidateData(candidateDoc) {
    
	if(candidateDoc.first_name && candidateDoc.last_name && candidateDoc.work_history)
	{
		const initials = createInitials(candidateDoc.first_name, candidateDoc.last_name);

		candidateDoc = filterWhiteListFields(candidateDoc, anonymosCandidateFields);
	    candidateDoc.work_history = candidateDoc.work_history.map((work) => {
	        delete work.companyname;
	        return work;
	    });
	    candidateDoc.initials = initials;   
	}	
    
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



module.exports.candidateAsCompany = async function candidateAsCompany(candidateDoc, companyId) {
    const acceptedJobOffer = await Chat.find({sender_id: candidateDoc._creator._id, receiver_id: companyId, msg_tag: 'job_offer_accepted'})
    if (acceptedJobOffer && acceptedJobOffer.length>0)
        return removeSensativeData(candidateDoc);

    else
        return anonymousSearchCandidateData(candidateDoc);

};