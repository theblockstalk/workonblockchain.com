const companies = require('../../../../model/mongoose/company');
const Users = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    let filteredUsers = [];
    const userDoc =await Users.findAndIterate({type: 'company'} , async function(companyUserDoc) {
        const empoyerProfile = await companies.findOne({_creator : companyUserDoc._id});
        if(empoyerProfile) filterReturnData.removeSensativeData(empoyerProfile._creator);
        filteredUsers.push(empoyerProfile);
    });

    if(filteredUsers && filteredUsers.length > 0) {
        res.send(filteredUsers);
    }

    else {
        errors.throwError("No candidate exists", 404)
    }

}