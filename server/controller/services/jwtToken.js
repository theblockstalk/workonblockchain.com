const jwt = require('jsonwebtoken');
const settings = require('../../settings');
const errors = require ('./errors');

module.exports.createJwtToken = function createJwtToken(user, options) {
    let payload = {
        id: user._id.toString(),
        type: user.type,
        created_date: user.created_date
    };

    if (options)
        return jwt.sign(payload, settings.EXPRESS_JWT_SECRET, options);

    else
        return jwt.sign(payload, settings.EXPRESS_JWT_SECRET);
};

module.exports.verifyJwtToken = function verifyJwtToken(token) {
    let result;
    try {
        result = jwt.verify(token, settings.EXPRESS_JWT_SECRET);
    } catch (error) {
        if (error.message === "jwt expired") {
            errors.throwError("jwt expired", 401);
        } else if (error.message === "jwt must be provided") {
            errors.throwError("jwt must be provided", 403);
        } else {
            throw error;
        }
    }
    return result;
};