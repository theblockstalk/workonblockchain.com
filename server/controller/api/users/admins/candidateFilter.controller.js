const candidateSearch = require('../candidate/searchCandidates');

const filterReturnData = require('../filterReturnData');

module.exports = async function (req,res) {
    let queryBody = req.body;

    let filter = {};
    if (queryBody.verify_status) filter.is_verify = queryBody.verify_status;
    if (queryBody.is_approve) filter.status = queryBody.is_approve;
    if (queryBody.account_status) filter.disable_account = true;
    if (!queryBody.account_status) filter.disable_account = false;
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