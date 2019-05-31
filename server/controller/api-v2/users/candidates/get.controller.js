const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const filterReturnData = require('../../../api/users/filterReturnData');

module.exports.request = {
    type: 'get',
    path: '/users/candidates'
};

const querySchema = new Schema({
    admin: Boolean,
    user_id: String
});

module.exports.inputValidation = {
    query: querySchema
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    console.log("adminnnnnn")
        console.log(typeof req.query.admin)
    if (req.query.admin) {
        await auth.isAdmin(req);
    }
}

module.exports.endpoint = async function (req, res) {
    let userId;
    if (req.query.admin || req.auth.user.type === 'company') userId = req.query.user_id;
    else userId = req.auth.user._id;

    const userDoc = await users.findByIdAndPopulate(userId);
    if(userDoc) {
        let password = true;
        if (!userDoc.password_hash) password = false;
        const filterData = filterReturnData.removeSensativeData(userDoc);
        filterData.password = password;
        //if(req.auth.user.type === 'company') res.send(await filterReturnData.candidateAsCompany(userDoc, userId)); will do later
        res.send(filterData);
    }
    else {
        errors.throwError("User not found", 404);
    }
}