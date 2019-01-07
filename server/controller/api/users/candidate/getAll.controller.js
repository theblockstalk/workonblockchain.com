const User = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    let filteredUsers = [];
    await User.findAndIterate({type : 'candidate'}, async function(userDoc) {
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
