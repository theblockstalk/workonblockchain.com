const settings = require('../../../../settings');
const logger = require('../../../services/logger');
const EmployerProfile = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    logger.debug('req.file', {file: req.file});
    let path;

    if (settings.isLiveApplication()) {
        path = req.file.location; // for S3 bucket
    } else {
        path = settings.FILE_URL + req.file.filename;
    }

    let userId = req.auth.user._id;
    const employerDoc = await EmployerProfile.findOne({ _creator: userId });
    if(employerDoc) {
        await EmployerProfile.update({ _creator: userId },{ $set: {'company_logo' : path } });
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("Company account not found", 404);
    }
}

