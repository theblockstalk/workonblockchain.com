const companies = require('../../../../model/mongoose/company');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    employerProfile =  await companies.findOne({_creator : req.params._id});
    if(employerProfile){
        const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile);
        res.send(employerCreatorRes);
    }
    else
    {
        errors.throwError("User not found", 404)
    }

}

