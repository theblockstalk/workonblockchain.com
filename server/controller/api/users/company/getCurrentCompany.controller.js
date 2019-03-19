const companies = require('../../../../model/mongoose/company');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    console.log("id");
    console.log(req.params._id);
    const employerProfile =  await companies.findOneAndPopulate(req.params._id);
    console.log(employerProfile);
    if(employerProfile){
        const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile);
        res.send(employerCreatorRes);
    }
    else
    {
        errors.throwError("User not found", 404)
    }

}

