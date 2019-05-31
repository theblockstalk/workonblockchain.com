const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const companies = require('../../../../model/mongoose/company');
const Users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const filterReturnData = require('../filterReturnData');

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
    const employerProfile = await
    companies.findOneAndPopulate(req.query.user_id);
    if (employerProfile) {
        const employerCreatorRes = filterReturnData.removeSensativeData(employerProfile);
        res.send(employerCreatorRes);
    }
    else errors.throwError("Company doc not found", 404);
}