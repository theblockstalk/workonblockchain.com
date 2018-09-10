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
	
	
	let userId = req.auth.user._id;
		
    destroy_token(userId).then(function (err, about)
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

function destroy_token(id){
    var deferred = Q.defer();
    ////console.log(data.user_id);
    let token=null;
    var set =
        {
            jwt_token: token,

        };
    users.update({ _id: id},{ $set: set }, function (err, doc)
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