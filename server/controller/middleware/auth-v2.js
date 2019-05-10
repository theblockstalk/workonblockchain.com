const jwtToken = require('../services/jwtToken');
const users = require('../../model/mongoose/users');
const errors = require('../services/errors');

async function getUserFromToken(req) {
    if (!req.auth) {
        let token = req.headers.authorization;
        let payload = jwtToken.verifyJwtToken(token);

        const user = await users.findOneById(payload.id);

        if (user.jwt_token !== token) errors.throwError("Jwt token not found", 401);

        req.auth = {
            user: user
        };
    }
}

module.exports.isLoggedIn = async function (req) {
    await getUserFromToken(req);
}

module.exports.isAdmin = async function (req) {
    await getUserFromToken(req);
    if (req.auth.user.is_admin !== 1) errors.throwError("User is not an admin", 403);
}

module.exports.isValidUser = async function (req) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.is_verify !== 1) errors.throwError("User is not verified", 403);
    if (user.type === 'company'){
        if (user.is_approved !== 1) errors.throwError("User is not a approved", 403);
    }
    if (user.type === 'candidate') {
        if (!user.first_approved_date) errors.throwError("User is not a approved", 403);
    }
}

module.exports.isValidCompany = async function (req) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'company') errors.throwError("User is not a company", 403);
    if (user.is_verify !== 1) errors.throwError("User is not verified", 403);
    if (user.is_approved !== 1) errors.throwError("User is not a approved", 403);
    if (user.disable_account !== false) errors.throwError("User account was dissabled", 403);
}

module.exports.isValidCandidate = async function (req) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'candidate') errors.throwError("User is not a candidate", 403);
    if (user.is_verify !== 1) errors.throwError("User is not verified", 403);
    if (!user.first_approved_date) errors.throwError("User is not a approved", 403);
    if (user.disable_account !== false) errors.throwError("User account was dissabled", 403);
}


module.exports.isCandidateType = async function(req) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'candidate') {
        errors.throwError("Can only be called by a candidate")
    }

}

module.exports.isCompanyType = async function(req) {
    await getUserFromToken(req);
    let user = req.auth.user;
    if (user.type !== 'company') {
        errors.throwError("Can only be called by a company")
    }
}