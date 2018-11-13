const EmployerProfile = require('../../../../model/employer_profile');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    let userId = req.auth.user;
    if(userId._id === req.params._id || userId.is_admin === 1 ) {
        let employerProfile = await EmployerProfile.findById(req.params._id).populate('_creator').lean();
        if(employerProfile){
            const employerRes =  filterReturnData.removeSensativeData(employerProfile);
            res.send(employerRes);
        }
        else {
            employerProfile =  await EmployerProfile.find({_creator : req.params._id}).populate('_creator').lean();
            if(employerProfile && employerProfile.length > 0){
                const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile[0]);
                res.send(employerCreatorRes);
            }
            else
            {
                errors.throwError("User not found", 400)
            }
        }
    }

}

