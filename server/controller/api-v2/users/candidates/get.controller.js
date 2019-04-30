const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const filterReturnData = require('../../../api/users/filterReturnData');

module.exports.request = {
    type: 'get',
    path: '/users/:user_id/candidates'
};

const paramSchema = new Schema({
    user_id: String
});

const querySchema = new Schema({
    admin: Boolean
});

module.exports.inputValidation = {
    params: paramSchema,
    query: querySchema
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);

    if (req.query.admin) {
        await auth.isAdmin(req);
    }
}

module.exports.endpoint = async function (req, res) {
    let userId;
    if (req.query.admin) userId = req.params.user_id;

    else userId = req.auth.user._id;

    const userDoc = await users.findByIdAndPopulate(userId);

    if(userDoc) {
        let password = true;
        if (!userDoc.password_hash) password = false;
        const filterData = filterReturnData.removeSensativeData(userDoc);
        filterData.password = password;
        console.log(filterData);
        res.send(filterData);
    }
    else {
        errors.throwError("User not found", 404);
    }

}