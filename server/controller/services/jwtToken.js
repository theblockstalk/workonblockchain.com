const jwt = require('jsonwebtoken');
const settings = require('../../settings');

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
    return jwt.verify(token, settings.EXPRESS_JWT_SECRET);
};