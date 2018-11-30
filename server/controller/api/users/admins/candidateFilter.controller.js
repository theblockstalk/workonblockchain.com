const candidateSearch = require('../candidate/searchCandidates');

const filterReturnData = require('../filterReturnData');

module.exports = async function (req,res) {
    let queryBody = req.body;
    let verify;
    let disable_account;
    if(queryBody.status === '1') {
        verify = 1;
    }
    if(queryBody.status === 'true') {
        disable_account = true;
    }

    let filter = {};
    if (verify) filter.is_verify = 1;
    if (queryBody.is_approve) filter.status = queryBody.is_approve;
    if (disable_account === true) filter.disable_account = true;
    if (queryBody.msg_tags) filter.msg_tags = queryBody.msg_tags;

    let candidateDocs = await candidateSearch.candidateSearch(filter, {
        word: queryBody.word
    });

    for (candidateDoc of candidateDocs.candidates) {
        await filterData(candidateDoc);
    }
    res.send(candidateDocs.candidates);
}

let filterData = async function filterData(candidateDetail) {
    return filterReturnData.removeSensativeData(candidateDetail);
}