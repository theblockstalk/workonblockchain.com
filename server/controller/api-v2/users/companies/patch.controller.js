const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const companies = require('../../../../model/mongoose/company');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id/companies'
};

module.exports.auth = async function (req) {
    await auth.isValidUser(req);
}

module.exports.endpoint = async function (req, res) {
    let userId = req.auth.user._id;
    const employerDoc = await companies.findOne({ _creator: userId });

    if(employerDoc){
        const queryBody = req.body;
        let employerUpdate = {}

        if (queryBody.info.first_name) employerUpdate.first_name = queryBody.info.first_name;
        if (queryBody.info.last_name) employerUpdate.last_name = queryBody.info.last_name;
        if (queryBody.info.job_title) employerUpdate.job_title = queryBody.info.job_title;
        if (queryBody.info.company_name) employerUpdate.company_name = queryBody.info.company_name;
        if (queryBody.info.company_website) employerUpdate.company_website = queryBody.info.company_website;
        if (queryBody.info.phone_number) employerUpdate.company_phone = queryBody.info.phone_number;
        if (queryBody.info.country) employerUpdate.company_country = queryBody.info.country;
        if (queryBody.info.city) employerUpdate.company_city = queryBody.info.city;
        if (queryBody.info.postal_code) employerUpdate.company_postcode = queryBody.info.postal_code;
        if (queryBody.info.company_founded) employerUpdate.company_founded = queryBody.info.company_founded;
        if (queryBody.info.no_of_employees) employerUpdate.no_of_employees = queryBody.info.no_of_employees;
        if (queryBody.info.company_funded) employerUpdate.company_funded = queryBody.info.company_funded;
        if (queryBody.info.company_description) employerUpdate.company_description = queryBody.info.company_description;
        if (queryBody.saved_searches && queryBody.saved_searches.length > 0) employerUpdate.saved_searches = queryBody.saved_searches;

        await companies.update({ _creator: userId },{ $set: employerUpdate });

        res.send(true);
    }

    else {
        errors.throwError("Company account not found", 404);
    }
}