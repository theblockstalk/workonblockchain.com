const EmployerProfile = require('../../../../model/employer_profile');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    let employerProfile = await EmployerProfile.findById(req.params._id).populate('_creator').lean();
    if(employerProfile){
        const employerRes =  filterReturnData.removeSensativeData(employerProfile);
        res.send(employerRes);
    }
    else {
        employerProfile =  await EmployerProfile.find({_creator : req.params._id}).populate('_creator').lean();
        if(employerProfile && employerProfile.length > 0){
            console.log("iffff");
            const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile[0]);
            res.send(employerCreatorRes);
        }
        else
        {
            errors.throwError("User not found", 404)
        }
    }

}

