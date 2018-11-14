var Q = require('q');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    const candidateDoc = await CandidateProfile.find().populate('_creator').lean();
    if(candidateDoc && candidateDoc.length > 0) {
        for (detail of candidateDoc) {
            await filterData(detail);
        }
        res.send(candidateDoc);
    }
    else {
        errors.throwError("No candidate exists", 404)
    }
}

let filterData = async function filterData(detail) {
    if(detail._creator !== null) {
        filterReturnData.removeSensativeData(detail);
    }
}

