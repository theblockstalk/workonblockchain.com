const settings = require('../../../../settings');
const users = require('../../../../model/mongoose/users');
const logger = require('../../../services/logger');
const errors = require('../../../services/errors');

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

    const candidateDoc = await users.findOneById(userId);
    if(candidateDoc) {
        await users.update({ _id: userId },{ $set: {'image' : path } });
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

}
