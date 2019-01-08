const EmployerProfile = require('../../../../model/mongoose/company');
const Users = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    let filteredUsers = [];
    const userDoc =await Users.findAndIterate({type: 'company'} , async function(companyUserDoc) {
        const empoyerProfile = await EmployerProfile.findOne({_creator : companyUserDoc._id});
        filterReturnData.removeSensativeData(empoyerProfile._creator);
        filteredUsers.push(empoyerProfile);
    });

    if(filteredUsers && filteredUsers.length > 0) {
        res.send(filteredUsers);
    }

    else {
        errors.throwError("No candidate exists", 404)
    }

}