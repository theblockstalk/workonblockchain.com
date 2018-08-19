const jwtToken = require('../services/jwtToken');
const mongooseUsers = require('../../model/users');
const express = require('express');


function getUserFromToken(req, cb) {
	//console.log(JSON.stringify(req.headers));

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFVXRWdmNnT2tDNGhQdHpHTlVaV0JBPT0iLCJpYXQiOjE1MzQ0MjQ0NjR9.SrbIyFDNIDr_yFJ-EotJiMMp7a26Ji7rZg4jlvU4a-w';//req.getHeader("Content-Language") // TODO: not sure if this is right

    let payload = jwtToken.verifyJwtToken(token);

    mongooseUsers.findOne({_id: payload.id}, function(user) {
        if (user.token !== token) throw new Error("Jwt token not found");

        req.auth = {
            user: user
        };

        cb();
    });
};

module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
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