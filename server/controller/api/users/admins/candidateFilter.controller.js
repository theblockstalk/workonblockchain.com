const candidateSearch = require('../candidate/searchCandidates');

const filterReturnData = require('../filterReturnData');

module.exports = async function (req,res) {
    let queryBody = req.body;
    let verify;
    let disable_account;
    if(queryBody.verify_status === '1') {
        verify = 1;
    }
    if(queryBody.verify_status === '0') {
        verify = 0;
    }
    if(queryBody.account_status === 'true') {
        disable_account = true;
    }
    if(queryBody.account_status === 'false') {
        disable_account = false;
    }

    let filter = {};
    if (verify === 1 || verify === 0) filter.is_verify = verify;
    if (queryBody.is_approve) filter.status = queryBody.is_approve;
    if (disable_account === true || disable_account === false) filter.disable_account = disable_account;
    if (queryBody.msg_tags) filter.msg_tags = queryBody.msg_tags;

    let search = {};
    if (queryBody.word) {
        search.name = queryBody.word
    }

    let candidateDocs = await candidateSearch.candidateSearch(filter, search);

    for (let candidateDoc of candidateDocs.candidates) {
        await filterData(candidateDoc);
    }

    res.send(candidateDocs.candidates);
}

let filterData = async function filterData(candidateDetail) {
    return filterReturnData.removeSensativeData(candidateDetail);
}