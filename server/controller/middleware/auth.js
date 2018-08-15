const jwtToken = require('../services/jwtToken');
const mongooseUsers = require('../../model/users');


module.exports.isLoggedIn = isLoggedIn;
async function isLoggedIn(req, res, next) {
    let token = req.header.someHeaderField // TODO: not sure if this is right

    let payload = jwtToken.verifyJwtToken(token);

    let user = await mongooseUsers.findOne({_id: payload.id});

    if (user.token !== token) throw new Error("Jwt token not found");

    req.auth = {
        user: user
    };

    next();
};

module.exports.isAdmin = async function isAdmin(req, res, next) {
    await isLoggedIn();
    if (req.auth.user.is_admin !== true) throw new Error("User is not an admin");
};

module.exports.isValidUser = async function isValidUser(req, res, next) {
    await isLoggedIn();
    let user = req.auth.user;
    if (user.is_verify !== true) throw new Error("User is not verified");
    if (user.is_approved !== true) throw new Error("User is not a approved");
}

module.exports.isValidCompany = async function isValidCompany(req, res, next) {
    await isLoggedIn();
    let user = req.auth.user;
    if (user.type !== 'company') throw new Error("User is not a company");
    if (user.is_verify !== true) throw new Error("User is not verified");
    if (user.is_approved !== true) throw new Error("User is not a approved");
    if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection
};


module.exports.isValidCandidate = async function isValidCandidate(req, res, next) {
    await isLoggedIn();
    let user = req.auth.user;
    if (user.type !== 'candidate') throw new Error("User is not a candidate");
    if (user.is_verify !== true) throw new Error("User is not verified");
    if (user.is_approved !== true) throw new Error("User is not a approved");
    if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection
};