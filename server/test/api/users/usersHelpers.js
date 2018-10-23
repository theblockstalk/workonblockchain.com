const Users = require('../../../model/users');

module.exports.approve = async function approve(email) {
    await Users.update({email: email}, {$set: {is_approved: 1}});
}

module.exports.makeAdmin = async function makeAdmin(email) {
    await Users.update({email: email}, {$set: {is_admin: 1}});
}

module.exports.verifyEmail = async function verifyEmail(email) {
    await Users.update({email: email}, {$set: {is_verify: 1}});
}