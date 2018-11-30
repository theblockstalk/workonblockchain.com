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
    console.log("input parameter");
    console.log(queryBody.salary);
    console.log(queryBody.currency);
    let candidateDocs = await candidateSearch.candidateSearch({
            is_verify: 1,
            status: 'approved',
            disable_account: false
        }, {
        word: queryBody.word,
        skills: queryBody.skills,
        locations: queryBody.location,
        positions: queryBody.position,
        blockchains: queryBody.blockchain,
        salary: {
            current_currency: queryBody.currency,
            current_salary: queryBody.salary
        },
        availability_day: queryBody.availability
    });

    let filterArray = [];
    for(candidateDetail of candidateDocs.candidates) {
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