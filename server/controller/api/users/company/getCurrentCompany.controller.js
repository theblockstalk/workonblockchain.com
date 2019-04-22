const companies = require('../../../../model/mongoose/company');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const myUserDoc = req.auth.user;
    console.log("params");
    console.log(req.params._id);
    if(myUserDoc._id.toString() === req.params._id || myUserDoc.is_admin === 1) {
        const employerProfile =  await companies.findOneAndPopulate(req.params._id);
        if(employerProfile){
            const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile);
            res.send(employerCreatorRes);
        }
        else
        {
            errors.throwError("User not found", 404)
        }
    }
    else {
        errors.throwError("Authentication failed", 400);
    }

}

