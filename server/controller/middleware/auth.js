const jwtToken = require('../services/jwtToken');
const mongooseUsers = require('../../model/users');
const asyncMiddleware = require('./asyncMiddleware');

async function getUserFromToken(req) {
    let token = req.headers.authorization;
    let payload = jwtToken.verifyJwtToken(token);

    const user = await mongooseUsers.findOne({_id : payload.id});

    if (user.jwt_token !== token) throw new Error("Jwt token not found");

    req.auth = {
        user: user
    };
    
}

module.exports.isLoggedIn = asyncMiddleware(async function isLoggedIn(req, res, next) {
    await getUserFromToken(req);
    next();
});

module.exports.isAdmin = asyncMiddleware(async function (req, res, next) {
    await getUserFromToken(req);
    if (req.auth.user.is_admin !== true) throw new Error("User is not an admin");
    next();
});

module.exports.isValidUser = asyncMiddleware(async function isValidUser(req, res, next) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.is_verify !== true) throw new Error("User is not verified");
    if (user.is_approved !== true) throw new Error("User is not a approved");
    next();
});

module.exports.isValidCompany = asyncMiddleware(async function isValidCompany(req, res, next) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'company') throw new Error("User is not a company");
    if (user.is_verify !== true) throw new Error("User is not verified");
    if (user.is_approved !== true) throw new Error("User is not a approved");
    if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection
    // if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection
    next();
});

module.exports.isValidCandidate = asyncMiddleware(async function isValidCandidate(req, res, next) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'candidate') throw new Error("User is not a candidate");
    if (user.is_verify !== true) throw new Error("User is not verified");
    if (user.is_approved !== true) throw new Error("User is not a approved");
    // if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection
    next();
});