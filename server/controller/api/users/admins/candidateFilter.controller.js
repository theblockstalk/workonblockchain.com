const CandidateProfile = require('../../../../model/candidate_profile');
const Chat = require('../../../../model/chat');
const errors = require('../../../services/errors');

const filterReturnData = require('../filterReturnData');
const candidateSearch = require('../candidate/searchCandidates');

module.exports = async function (req,res) {
   let queryBody = req.body;

   let filter = {};
   if (queryBody.is_verify) filter.is_verify = queryBody.is_verify;
   if (queryBody.is_approve) filter.status = queryBody.is_approve;
   if (queryBody.disable_account) filter.disable_account = queryBody.disable_account;
   if (queryBody.msg_tags) filter.msg_tags = queryBody.msg_tags;

   let search = {};
   if (queryBody.word) {
       search.name = queryBody.word;
   }

   let candidateDocs = await candidateSearch.candidateSearch(filter, search);

    for (candidateDoc of candidateDocs.candidates) {
        await filterData(candidateDoc);
    }

    res.send(candidateDocs.candidates);
}

let filterData = async function filterData(candidateDetail) {
    return filterReturnData.removeSensativeData(candidateDetail);
}
