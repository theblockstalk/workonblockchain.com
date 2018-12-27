const User = require('../../../../model/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    const candidateUserDoc = await User.find().lean();
    if(candidateUserDoc) {
        for (detail of candidateUserDoc) {
            filterReturnData.removeSensativeData(detail);
        }
        res.send(candidateUserDoc);
    }
    else {
        errors.throwError("No candidate exists", 404)
    }
}
