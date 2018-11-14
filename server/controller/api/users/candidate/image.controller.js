const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');

///// for save candidate "image(sign-up)"  in db///////////////////

module.exports = async function (req, res) {
    logger.debug('req.file', {file: req.file});
    let path;
    if (settings.isLiveApplication()) {
        path = req.file.location; // for S3 bucket
    } else {
        path = settings.FILE_URL + req.file.filename;
    }
    
    let userId = req.auth.user._id;

    const candidateDoc = await CandidateProfile.findOne({ _creator: userId }).lean();
    if(candidateDoc) {
        await CandidateProfile.update({ _creator: userId },{ $set: {'image' : path } });
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

}
