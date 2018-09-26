const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');

const logger = require('../../../services/logger');

module.exports = function (req,res){
    set_disable_status(req.body).then(function (err, about)
    {
        if (about)
        {
            res.json(about);
        }
        else
        {
            res.json(err);
        }
    })
    .catch(function (err)
    {
        res.json({error: err});
    });
}

function set_disable_status(data){
    var deferred = Q.defer();
    let timestamp = new Date();
    var set =
    {
        disable_account: data.status,
        dissable_account_timestamp : timestamp,

    };
    users.update({ _id: data.user_id},{ $set: set }, function (err, doc)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            deferred.resolve(set);
    });
    return deferred.promise;
}