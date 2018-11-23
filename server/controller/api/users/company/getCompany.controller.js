const EmployerProfile = require('../../../../model/employer_profile');
const filterReturnData = require('../filterReturnData');

module.exports = async function (req, res) {

    const employerDoc = await EmployerProfile.find().populate('_creator').lean();

    for (detail of employerDoc) {
        await filterData(detail);
    }
    res.send(employerDoc);
}

let filterData = async function filterData(detail) {
    if(detail._creator !== null)
    {
        filterReturnData.removeSensativeData(detail);
    }
}