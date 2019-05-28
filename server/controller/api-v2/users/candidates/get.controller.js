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

    if (req.query.admin === true || req.query.admin === 'true') await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    let userId;
    if ((req.query.admin === true || req.query.admin === 'true') || req.auth.user.type === 'company') {
        userId = req.query.user_id;
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
    else {
        userId = req.auth.user._id;

        const candidateDoc = await users.findByIdAndPopulate(req.query.user_id);
        if(candidateDoc ) {
            if(req.auth.user.type === 'company'){
                const filterData = await filterReturnData.candidateAsCompany(candidateDoc,userId);
                res.send(filterData);
            }
            else res.send(candidateDoc);
        }
        else {
            errors.throwError("Candidate account not found", 404);
        }
    }
}