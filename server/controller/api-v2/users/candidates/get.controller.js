const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const filterReturnData = require('../../../api/users/filterReturnData');

module.exports.request = {
    type: 'get',
    path: '/users/candidates'
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);

}

module.exports.endpoint = async function (req, res) {
    let filteredUsers = [];
    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        filterReturnData.removeSensativeData(userDoc);
        filteredUsers.push(userDoc);
    });

    if(filteredUsers && filteredUsers.length > 0) {
        res.send(filteredUsers);
    }

    else {
        errors.throwError("No candidate exists", 404)
    }
}