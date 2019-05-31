const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const companies = require('../../../../model/mongoose/company');
const Users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const filterReturnData = require('../../../api/users/filterReturnData');

module.exports.request = {
    type: 'get',
    path: '/users/companies'
};

const querySchema = new Schema({
    user_id: String,
    admin: {
        type: String,
        enum: ['true']
    }
});

module.exports.inputValidation = {
    query: querySchema
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if(req.query.admin) await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    const userDoc = req.auth.user;
    if(req.query.admin  && userDoc.is_admin === 1){
        let filteredUsers = [];
        const userDoc = await Users.findAndIterate({type: 'company'} , async function(companyUserDoc) {
            const empoyerProfile = await companies.findOne({_creator : companyUserDoc._id});
            if(empoyerProfile) filterReturnData.removeSensativeData(empoyerProfile._creator);
            filteredUsers.push(empoyerProfile);
        });

        if(filteredUsers && filteredUsers.length > 0) res.send(filteredUsers);
        else errors.throwError("No company exists", 404);
    }
    else {
        const employerProfile = await
        companies.findOneAndPopulate(req.query.user_id);
        if (employerProfile) {
            const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile);
            res.send(employerCreatorRes);
        }
        else errors.throwError("User not found", 404);
    }
}