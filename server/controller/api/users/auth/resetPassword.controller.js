const settings = require('../../../../settings');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
var jwt_hash = require('jwt-simple');
const logger = require('../../../services/logger');
var crypto = require('crypto');

module.exports = function (req,res)
{
    // //console.log(req.params.hash);
    reset_password(req.params.hash,req.body).then(function (err, data)
    {
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });

}

function reset_password(hash,data)
{
    var deferred = Q.defer();
    ////console.log(hash);
    ////console.log(data);
    var token = jwt_hash.decode(hash, settings.EXPRESS_JWT_SECRET, 'HS256');
    ////console.log("data");
    ////console.log(data);
    if(new Date(token.expiry) > new Date())
    {
        ////console.log(token);
        users.findOne({ forgot_password_key :hash  }, function (err, result)
        {

            console.log(result);
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if(result)
            {
                updateData(result._id);
            }

            else
            {
                deferred.reject("Result not found");
            }

        });

        function updateData(_id)
        {
        	 let salt = crypto.randomBytes(16).toString('base64');
             let hash = crypto.createHmac('sha512', salt);
     		hash.update(data.password);
     		let hashedPasswordAndSalt = hash.digest('hex');
     		////console.log(hashedPasswordAndSalt);

             var set =
                 {
             		password_hash:hashedPasswordAndSalt,
             		salt :salt
                 };
            users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                {
                    deferred.resolve({msg:'Password reset successfully'});
                }
            });
        }
    }
    else
    {
        deferred.reject('Link expired');
    }

    return deferred.promise;
}