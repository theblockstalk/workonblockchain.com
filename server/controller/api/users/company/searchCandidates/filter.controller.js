const settings = require('../../../../../settings');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const errors = require('../../../../services/errors');
const searchCandidates = require('../../candidate/searchCandidates');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const filterReturnData = require('../../filterReturnData');
const candidateSearch = require('.././searchCandidates');

module.exports = async  function (req,res)
{
    let userId = req.auth.user._id;
    let queryBody = req.body;
    let candidateDocs = await candidateSearch.candidateSearch({
            is_verify: 1,
            status: 'approved',
            disable_account: false
        }, {
        word: queryBody.word,
        skills: queryBody.skills,
        locations: [queryBody.location],
        positions: [queryBody.position],
        blockchains: [queryBody.blockchain],
        salary: {
            current_currency: queryBody.currency,
            current_currency: queryBody.salary
        },
        availability_day: queryBody.availability
    });

    let filterArray = [];
    for(candidateDetail of candidateDocs.candidates) {
        const filterDataRes = await filterData(candidateDetail , userId);
        filterArray.push(filterDataRes);
    }

    res.send(filterArray);

}

let filterData = async function filterData(candidateDetail , userId) {
    return filterReturnData.candidateAsCompany(candidateDetail,userId);
}