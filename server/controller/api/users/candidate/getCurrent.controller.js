const User = require('../../../../model/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const candidateDoc = await User.findById(req.params._id).lean();
    if(candidateDoc) {
        const filterData = filterReturnData.removeSensativeData(candidateDoc);
        res.send(filterData);
    }
    else {
        errors.throwError("User not found", 404);
    }

}