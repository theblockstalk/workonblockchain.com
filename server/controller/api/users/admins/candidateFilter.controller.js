const candidateSearch = require('../candidate/searchCandidates');

const filterReturnData = require('../filterReturnData');

module.exports = async function (req,res) {
    let queryBody = req.body;

    let filter = {};
    if (queryBody.verify_status) filter.is_verify = parseInt(queryBody.verify_status);
    if (queryBody.is_approve) filter.status = queryBody.is_approve;
    if (queryBody.msg_tags) filter.msg_tags = queryBody.msg_tags;
    if (queryBody.account_status === 'true') filter.disable_account = true;
    else filter.disable_account = false;

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