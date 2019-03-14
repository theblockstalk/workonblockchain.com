const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');
const crypto = require('crypto');

module.exports = async function (req, res) {
    const myUserDoc = req.auth.user;
    if(String(myUserDoc._id) === req.params._id || myUserDoc.is_admin === 1) {
        const userDoc = await users.findByIdAndPopulate(req.params._id);
        if(userDoc) {
            let password = true;
            if (!userDoc.password_hash) password = false;
            const filterData = filterReturnData.removeSensativeData(userDoc);
            filterData.password = password;
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