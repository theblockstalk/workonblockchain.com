var Q = require('q');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const candidateDoc = await CandidateProfile.findById(req.params._id).populate('_creator').lean();
    if(candidateDoc && candidateDoc.length > 0) {
        const filterData = filterReturnData.removeSensativeData(candidateDoc);
        res.send(filterData);
    }
    else {
        const candidateProfileDoc = await CandidateProfile.find({_creator : req.params._id}).populate('_creator' ).lean();
        if(candidateProfileDoc && candidateProfileDoc.length > 0) {
            const candidateFilterData = filterReturnData.removeSensativeData(candidateProfileDoc[0]);
            res.send(candidateFilterData);
        }
        else {
            errors.throwError("User not found", 404);
        }
    }

}