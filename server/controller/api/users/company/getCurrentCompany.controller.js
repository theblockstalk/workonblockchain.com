const EmployerProfile = require('../../../../model/mongoose/company');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
console.log(req.params);
console.log(req.body);
    let employerProfile = await EmployerProfile.findOneById(req.params._id);
    if(employerProfile){
        const employerRes =  filterReturnData.removeSensativeData(employerProfile);
        res.send(employerRes);
    }
    else {
        employerProfile =  await EmployerProfile.findOne({_creator : req.params._id});
        if(employerProfile){
            const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile);
            res.send(employerCreatorRes);
        }
        else
        {
            errors.throwError("User not found", 404)
        }
    }

}

