const User = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const filterReturnData = require('../../filterReturnData');
const errors = require('../../../../services/errors');

module.exports = async function (req,res) {

    let userId = req.auth.user._id;

    const candidateDocs = await candidateSearch.candidateSearch({
        is_verify: 1,
        status: 'approved',
        disable_account: false
    }, {});

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

async function filterData(candidateDetail , userId) {
    return filterReturnData.candidateAsCompany(candidateDetail,userId);
}