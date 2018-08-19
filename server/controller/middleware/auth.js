const jwtToken = require('../services/jwtToken');
const mongooseUsers = require('../../model/users');
const logger = require('../services/logger');

function getUserFromToken(req, cb) {
    logger.debug('req', {req: req});
    let token = req.headers.authorization; 
    let payload = jwtToken.verifyJwtToken(token);

    mongooseUsers.findOne({_id : payload.id}, function (err, user)
    {
    	if (user.jwt_token !== token) throw new Error("Jwt token not found");
        
        req.auth = {
            user: user
        };

        cb();
    	
    	
    });
    
};

module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
    //console.log(JSON.stringify(req, null, 2));
    getUserFromToken(req, next);
};

module.exports.isAdmin = function isAdmin(req, res, next) {
    getUserFromToken(req, () => {
        if (req.auth.user.is_admin !== true) throw new Error("User is not an admin");
        next();
    });

};

module.exports.isValidUser = function isValidUser(req, res, next) {
    getUserFromToken(req, () => {
        let user = req.auth.user;
        if (user.is_verify !== true) throw new Error("User is not verified");
        if (user.is_approved !== true) throw new Error("User is not a approved");
        next();
    });
};

module.exports.isValidCompany = function isValidCompany(req, res, next) {
    getUserFromToken(req, () => {
        let user = req.auth.user;
        if (user.type !== 'company') throw new Error("User is not a company");
        if (user.is_verify !== true) throw new Error("User is not verified");
        if (user.is_approved !== true) throw new Error("User is not a approved");
        if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection
        // if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection
        next();
    });
};

module.exports.isValidCandidate = function isValidCandidate(req, res, next) {
    getUserFromToken(req, () => {
        let user = req.auth.user;
        if (user.type !== 'candidate') throw new Error("User is not a candidate");
        if (user.is_verify !== true) throw new Error("User is not verified");
        if (user.is_approved !== true) throw new Error("User is not a approved");
        if (user.disable_account !== false) throw new Error("User account was dissabled"); // TODO: disable_account should be in the user collection

        next();
    });
};