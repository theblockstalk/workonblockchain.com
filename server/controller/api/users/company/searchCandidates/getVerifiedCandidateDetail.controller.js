const users = require('../../../../../model/mongoose/users');
const filterReturnData = require('../../filterReturnData');
const errors = require('../../../../services/errors');

module.exports = async  function (req, res) {

    let userId = req.auth.user._id;
    let queryBody = req.body;

    const candidateDoc = await users.findByIdAndPopulate(queryBody._id);
    if(candidateDoc ) {
        const filterData = await filterReturnData.candidateAsCompany(candidateDoc,userId);
        res.send(filterData);
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

}