var Q = require('q');
const CandidateProfile = require('../../../../../model/candidate_profile');
const filterReturnData = require('../../filterReturnData');
const errors = require('../../../../services/errors');

module.exports = async  function (req, res) {

    let userId = req.auth.user._id;
    let queryBody = req.body;

    const candidateDoc = await CandidateProfile.find({_creator : queryBody._id}).populate('_creator').lean();
    if(candidateDoc && candidateDoc.length > 0) {
        const filterData = await filterReturnData.candidateAsCompany(candidateDoc[0],userId);
        res.send(filterData);
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

}