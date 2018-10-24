const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const logger = require('../../../services/logger');
var crypto = require('crypto');

module.exports = function (req,res)
{
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

function reset_password(forgotPasswordToken , newPassword)
{
    var deferred = Q.defer();

    //var token = jwt_hash.decode(hash, settings.EXPRESS_JWT_SECRET, 'HS256');

    //if(new Date(token.expiry) > new Date())
    //{

        users.findOne({ forgot_password_key : forgotPasswordToken}, function (err, result)
        {

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
     		hash.update(newPassword.password);
     		let hashedPasswordAndSalt = hash.digest('hex');

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
    //}
    //else
    //{
        //deferred.reject('Link expired');
    //}

    return deferred.promise;
}