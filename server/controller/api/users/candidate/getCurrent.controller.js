const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const myUserDoc = req.auth.user;
    if(String(myUserDoc._id) === req.params._id || myUserDoc.is_admin === 1) {
        const candidateDoc = await users.findOneByIdWithPopulate(req.params._id);
        if(candidateDoc) {
            const filterData = filterReturnData.removeSensativeData(candidateDoc);
            res.send(filterData);
        }
        else {
            errors.throwError("User not found", 404);
        }
    }
    else {
        errors.throwError("Authentication failed", 400);
    }
}