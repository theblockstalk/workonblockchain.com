const EmployerProfile = require('../../../../model/employer_profile');
const logger = require('../../../services/logger');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

	let userId = req.auth.user._id;
    const employerDoc = await EmployerProfile.findOne({ _creator: userId }).lean();

    if(employerDoc){
        const companyParam = req.body;
        let employerUpdate = {}

        if (companyParam.first_name) employerUpdate.first_name = companyParam.first_name;
        if (companyParam.last_name) employerUpdate.last_name = companyParam.last_name;
        if (companyParam.job_title) employerUpdate.job_title = companyParam.job_title;
        if (companyParam.company_name) employerUpdate.company_name = companyParam.company_name;
        if (companyParam.company_website) employerUpdate.company_website = companyParam.company_website;
        if (companyParam.phone_number) employerUpdate.company_phone = companyParam.phone_number;
        if (companyParam.country) employerUpdate.company_country = companyParam.country;
        if (companyParam.city) employerUpdate.company_city = companyParam.city;
        if (companyParam.postal_code) employerUpdate.company_postcode = companyParam.postal_code;
        if (companyParam.company_founded) employerUpdate.company_founded = companyParam.company_founded;
        if (companyParam.no_of_employees) employerUpdate.no_of_employees = companyParam.no_of_employees;
        if (companyParam.company_funded) employerUpdate.company_funded = companyParam.company_funded;
        if (companyParam.company_description) employerUpdate.company_description = companyParam.company_description;

        await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });

        res.send({
            success : true
        })
    }

    else {
        errors.throwErrors("Company account not found", 400);
    }

}

