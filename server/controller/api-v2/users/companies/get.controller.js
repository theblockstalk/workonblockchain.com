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
    is_admin: Boolean
});

module.exports.inputValidation = {
    query: querySchema
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if(req.query.is_admin) await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    const myUserDoc = req.auth.user;
    if(req.query.is_admin === true && myUserDoc.is_admin === 1){
        console.log('you can call');
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
            errors.throwError("No company exists", 404)
        }
    }

    if(myUserDoc._id.toString() === req.query.user_id || myUserDoc.is_admin === 1) {
        const employerProfile =  await companies.findOneAndPopulate(req.query.user_id);
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