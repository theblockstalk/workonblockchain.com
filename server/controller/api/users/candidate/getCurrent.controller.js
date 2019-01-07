const User = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const candidateDoc = await User.findOneById(req.params._id);
    if(candidateDoc) {
        const filterData = filterReturnData.removeSensativeData(candidateDoc);
        res.send(filterData);
    }
    else {
        errors.throwError("User not found", 404);
    }

}