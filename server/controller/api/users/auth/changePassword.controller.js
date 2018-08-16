const settings = require('../../../../settings');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const logger = require('../../../services/logger');
var crypto = require('crypto');

module.exports = function (req,res)
{
    change_password(req.params.id , req.body).then(function (err, data)
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

function change_password(id , param)
{
    var deferred = Q.defer();
//console.log(param.password);
    //console.log(id);
    //console.log(token);
    users.findOne({_id :id }, function (err, user)
    {

        //console.log(user);
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if (user)
        {
        	let hash = crypto.createHmac('sha512', user.salt);
        	hash.update(param.current_password);
        	let hashedPasswordAndSalt = hash.digest('hex');
        	//console.log(hashedPasswordAndSalt);
        	if (hashedPasswordAndSalt === user.password_hash)
        	{
        		updatePassword(user._id);
        	}
        	else
        	{
        		deferred.reject("Current password is incorrect");
        	}
        }
        else
        {
            deferred.reject("Email not found");
        }


    });

    function updatePassword(_id )
    {
        //console.log(_id);

        //console.log(user.password);
        /*var user = _.omit(param, 'password');
        var salt = bcrypt.genSaltSync(10);

        // add hashed password to user object
        user.password = bcrypt.hashSync(param.password, salt);*/
        
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt);
		hash.update(param.password);
		let hashedPasswordAndSalt = hash.digest('hex');
		//console.log(hashedPasswordAndSalt);

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

                deferred.resolve({msg:'Password changed successfully'});
            }
        });
    }

    return deferred.promise;
}