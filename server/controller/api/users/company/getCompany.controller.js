const EmployerProfile = require('../../../../model/employer_profile');
const filterReturnData = require('../filterReturnData');

module.exports = async function (req, res) {

    const employerDoc = await EmployerProfile.find().populate('_creator').lean();

    let employerArray=[];
    employerDoc.forEach(function(detail)
    {
        if(detail._creator !== null)
        {
            employerArray.push(filterReturnData.removeSensativeData(detail));
        }

    });

    res.send(employerArray);
}