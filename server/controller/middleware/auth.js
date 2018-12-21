const jwtToken = require('../services/jwtToken');
const mongooseUsers = require('../../model/users');
const asyncMiddleware = require('./asyncMiddleware');
const errors = require('../services/errors');

async function getUserFromToken(req) {

    let token = req.headers.authorization;
    let payload = jwtToken.verifyJwtToken(token);

	const user = await mongooseUsers.findOne({_id : payload.id});

    if (user.jwt_token !== token) errors.throwError("Jwt token not found", 401);

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
    if (req.auth.user.is_admin !== 1) errors.throwError("User is not an admin", 403);
    next();
});

module.exports.isValidUser = asyncMiddleware(async function isValidUser(req, res, next) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.is_verify !== 1) errors.throwError("User is not verified", 403);
    if (user.type === 'company'){
        if (user.is_approved !== 1) errors.throwError("User is not a approved", 403);
    }
    if (user.type === 'candidate') {
        if (!user.first_approved_date) errors.throwError("User is not a approved", 403);
    }
    next();
});

module.exports.isValidCompany = asyncMiddleware(async function isValidCompany(req, res, next) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'company') errors.throwError("User is not a company", 403);
    if (user.is_verify !== 1) errors.throwError("User is not verified", 403);
    if (user.is_approved !== 1) errors.throwError("User is not a approved", 403);
    if (user.disable_account !== false) errors.throwError("User account was dissabled", 403);
    next();
});

module.exports.isValidCandidate = asyncMiddleware(async function isValidCandidate(req, res, next) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'candidate') errors.throwError("User is not a candidate", 403);
    if (user.is_verify !== 1) errors.throwError("User is not verified", 403);
    if (!user.first_approved_date) errors.throwError("User is not a approved", 403);
    if (user.disable_account !== false) errors.throwError("User account was dissabled", 403);
    next();
});