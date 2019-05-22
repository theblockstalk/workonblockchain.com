const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const companies = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');
const filterReturnData = require('../../../api/users/filterReturnData');

module.exports.request = {
    type: 'get',
    path: '/users/companies'
};

const querySchema = new Schema({
    user_id: String
});

module.exports.inputValidation = {
    query: querySchema
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
}

module.exports.endpoint = async function (req, res) {
    const myUserDoc = req.auth.user;
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