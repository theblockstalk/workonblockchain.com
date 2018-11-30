const settings = require('../../../../../settings');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const errors = require('../../../../services/errors');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const filterReturnData = require('../../filterReturnData');
const candidateSearch = require('../../candidate/searchCandidates');

module.exports = async  function (req,res)
{
    let userId = req.auth.user._id;
    let queryBody = req.body;
    console.log("query Body");
    console.log(queryBody);
    let search = {};
    if (queryBody.word) search.word = queryBody.word;
    if (queryBody.skills) search.skills = queryBody.skills;
    if (queryBody.locations) search.locations = queryBody.locations;
    if (queryBody.positions) search.positions = queryBody.positions;
    if (queryBody.blockchains) search.blockchains = queryBody.blockchains;
    if (queryBody.availability_day) search.availability_day = queryBody.availability_day;
    if (queryBody.current_currency && queryBody.current_salary) {
        search.salary = {
            current_currency: queryBody.current_currency,
            current_salary: queryBody.current_salary
        }
    }

    candidateDocs = await candidateSearch.candidateSearch({
            is_verify: 1,
            status: 'approved',
            disable_account: false
        }, search);

    let filterArray = [];
    for(let candidateDetail of candidateDocs.candidates) {
        const filterDataRes = await filterData(candidateDetail , userId);
        filterArray.push(filterDataRes);
    }

    if(filterArray.length > 0) {
        res.send(filterArray);
    }
    else {
        errors.throwError("No candidates matched the search", 404);
    }

}

let filterData = async function filterData(candidateDetail , userId) {
    return filterReturnData.candidateAsCompany(candidateDetail,userId);
}