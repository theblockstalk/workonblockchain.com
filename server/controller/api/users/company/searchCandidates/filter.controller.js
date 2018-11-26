const settings = require('../../../../../settings');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const errors = require('../../../../services/errors');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const filterReturnData = require('../../filterReturnData');

module.exports = async  function (req,res)
{
    let userId = req.auth.user._id;
    let queryBody = req.body;
    let salaryArray = [];
    let salaryConverterResult;
    if(queryBody.currency === '$ USD' && queryBody.salary)
    {
        salaryConverterResult = expected_salary_converter(queryBody.salary, USD.GBP , USD.Euro );
        salaryArray= {USD : queryBody.salary , GBP : salaryConverterResult[0] , Euro :salaryConverterResult[1]};
    }

    if(queryBody.currency === '£ GBP' && queryBody.salary)
    {
        salaryConverterResult = expected_salary_converter(queryBody.salary, GBP.USD , GBP.Euro );
        salaryArray= {USD : salaryConverterResult[0] , GBP : queryBody.salary , Euro :salaryConverterResult[1]};
    }
    if(queryBody.currency === '€ EUR' && queryBody.salary)
    {
        salaryConverterResult = expected_salary_converter(queryBody.salary, Euro.USD , Euro.GBP );
        salaryArray= {USD : salaryConverterResult[0] , GBP : salaryConverterResult[1]  , Euro : queryBody.salary};
    }

    const userDoc = await users.find({type : 'candidate' , is_verify :1, is_approved :1, disable_account : false }).lean();
    if(userDoc){
        let userDocArray = [];
        for (detail of userDoc) {
            userDocArray.push(detail._id);
        }

        let queryString = [];

        const usersToSearch = { "_creator": {$in: userDocArray}};
        queryString.push(usersToSearch);

        if(queryBody.position ) {
            const rolesFilter = { "roles": {$in: queryBody.position}};
            queryString.push(rolesFilter);
        }

        if(queryBody.skill !== -1 ) {
            const skillsFilter = {"programming_languages.language" :  queryBody.skill};
            queryString.push(skillsFilter);
        }

        if(queryBody.location !== -1) {
            const locationFilter = { "locations": {$in:queryBody.location} };
            queryString.push(locationFilter);
        }

        if(queryBody.blockchain) {
            const platformFilter = { $or: [
                {"commercial_platform.platform_name": {$in: queryBody.blockchain}},
                {"platforms.platform_name": {$in: queryBody.blockchain}}
            ] };
            queryString.push(platformFilter);
        }

        if(queryBody.availability!==-1) {
            const availabilityFilter = { availability_day: queryBody.availability };
            queryString.push(availabilityFilter);
        }

        if(salaryArray.length !== 0 && queryBody.currency!== -1 && queryBody.salary) {
            const searchFilter = {
                $or : [
                    { $and : [ { expected_salary_currency : "$ USD" }, { expected_salary : {$lte: salaryArray.USD} } ] },
                    { $and : [ { expected_salary_currency : "£ GBP" }, { expected_salary : {$lte: salaryArray.GBP} } ] },
                    { $and : [ { expected_salary_currency : "€ EUR" }, { expected_salary : {$lte: salaryArray.Euro} } ] }
                ]
            };
            queryString.push(searchFilter);
        }

        if(queryBody.word) {
            const wordSearch = { $or: [{ why_work: {'$regex' : queryBody.word , $options: 'i'  }} , { description : {'$regex' : queryBody.word , $options: 'i' } }] };
            queryString.push(wordSearch);
        }

        const searchQuery = { $and: queryString };
        const candidateDoc = await CandidateProfile.find(searchQuery).populate('_creator').lean();
        if(candidateDoc) {
            if(candidateDoc.length <= 0){
                errors.throwError("No candidates matched this search criteria", 404);
            }
            else
            {
                let filterArray = [];
                for(candidateDetail of candidateDoc) {
                    const filterDataRes = await filterData(candidateDetail , userId);
                    filterArray.push(filterDataRes);
                }

                res.send(filterArray);

            }

        }

    }
    else {
        errors.throwError("No candidates matched this search criteria", 404);
    }

}

function expected_salary_converter(salary_value, currency1, currency2)
{

    let value1 = (salary_value / currency1).toFixed();
    let value2 = (salary_value/currency2).toFixed();
    let array = [];

    array.push(value1);
    array.push(value2);

    return array;
}


let filterData = async function filterData(candidateDetail , userId) {
    return filterReturnData.candidateAsCompany(candidateDetail,userId);
}

