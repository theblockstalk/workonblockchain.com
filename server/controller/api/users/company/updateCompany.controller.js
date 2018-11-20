const EmployerProfile = require('../../../../model/employer_profile');
const User = require('../../../../model/users');
const logger = require('../../../services/logger');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

	let userId = req.auth.user._id;
    const employerDoc = await EmployerProfile.findOne({ _creator: userId }).lean();

    if(employerDoc){
        const queryBody = req.body;
        let employerUpdate = {}

        if (queryBody.first_name) employerUpdate.first_name = queryBody.first_name;
        if (queryBody.last_name) employerUpdate.last_name = queryBody.last_name;
        if (queryBody.job_title) employerUpdate.job_title = queryBody.job_title;
        if (queryBody.company_name) employerUpdate.company_name = queryBody.company_name;
        if (queryBody.company_website) employerUpdate.company_website = queryBody.company_website;
        if (queryBody.phone_number) employerUpdate.company_phone = queryBody.phone_number;
        if (queryBody.country) employerUpdate.company_country = queryBody.country;
        if (queryBody.city) employerUpdate.company_city = queryBody.city;
        if (queryBody.postal_code) employerUpdate.company_postcode = queryBody.postal_code;
        if (queryBody.company_founded) employerUpdate.company_founded = queryBody.company_founded;
        if (queryBody.no_of_employees) employerUpdate.no_of_employees = queryBody.no_of_employees;
        if (queryBody.company_funded) employerUpdate.company_funded = queryBody.company_funded;
        if (queryBody.company_description) employerUpdate.company_description = queryBody.company_description;
        if (queryBody.saved_searches && queryBody.saved_searches.length > 0) employerUpdate.saved_searches = queryBody.saved_searches;

        await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });

        res.send({
            success : true
        })
    }

    else {
        errors.throwError("Company account not found", 404);
    }

}

