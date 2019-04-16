const errors = require('../../../../services/errors');

const filterReturnData = require('../../filterReturnData');
const candidateSearch = require('../../candidate/searchCandidates');

module.exports = async  function (req,res)
{
    let userId = req.auth.user._id;
    let queryBody = req.body;
    console.log(queryBody.years_exp_min);
    let search = {}, order = {};
    if (queryBody.work_type) search.work_type = queryBody.work_type;
    if (queryBody.word) search.word = queryBody.word;
    if (queryBody.skills) search.skills = queryBody.skills;
    if (queryBody.years_exp_min) search.years_exp_min = queryBody.years_exp_min;
    if (queryBody.locations) {
        if(queryBody.locations.find((obj => obj.name === 'Remote'))) {
            const index = queryBody.locations.findIndex((obj => obj.name === 'Remote'));
            queryBody.locations[index] = {remote : true};
        }
        search.locations = queryBody.locations;
    }
    if (queryBody.visa_needed) search.visa_needed = queryBody.visa_needed;
    if (queryBody.positions) search.positions = queryBody.positions;
    if (queryBody.blockchains) search.blockchains = queryBody.blockchains;
    if (queryBody.current_currency && queryBody.current_salary) {
        search.salary = {
            current_currency: queryBody.current_currency,
            current_salary: queryBody.current_salary
        }
    }

    if (queryBody.expected_hourly_rate && queryBody.current_currency) {
        search.hourly_rate = {
            expected_hourly_rate: queryBody.expected_hourly_rate,
            current_currency: queryBody.current_currency
        }
    }
    if(queryBody.residence_country) search.residence_country = queryBody.residence_country;

    if (queryBody.blockchainOrder) order.blockchainOrder = queryBody.blockchainOrder;

    let candidateDocs = await candidateSearch.candidateSearch({
        is_verify: 1,
        status: 'approved',
        disable_account: false
    }, search, order);

    let filterArray = [];
    for(let candidateDetail of candidateDocs.candidates) {
        const filterDataRes = await filterData(candidateDetail , userId);
        filterArray.push(filterDataRes);
    }

    if(filterArray.length > 0) {
        res.send(filterArray);
    }
    else {
        errors.throwError("No candidates matched this search criteria", 404);
    }

}

let filterData = async function filterData(candidateDetail , userId) {
    return filterReturnData.candidateAsCompany(candidateDetail,userId);
}