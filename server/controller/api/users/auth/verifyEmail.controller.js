const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
var jwt_hash = require('jwt-simple');
const logger = require('../../../services/logger');

module.exports = function (req,res)
{
    //console.log(req.params.token);
    emailVerify(req.params.email_hash).then(function (err, data)
    {
        //console.log(data);
        console.log(err);
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })


}

function emailVerify(token)
{
    var deferred = Q.defer()
    var data = jwt_hash.decode(token, settings.EXPRESS_JWT_SECRET, 'HS256');
    if(new Date(data.expiry) > new Date())
    {
        users.findOne(  { email_hash:token  }, function (err, result)
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
                deferred.reject("Result not found");
        });

        function updateData(_id)
        {
            var set =
                {
                    is_verify: 1,
                };
            users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                    deferred.resolve({msg:'Email Verified'});
            });
        }
    }

    else
    {
        deferred.resolve({msg:'Link Expired'});
        //deferred.reject('Link expired');
    }
    return deferred.promise;

}