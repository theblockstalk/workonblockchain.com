const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const users = require('../../../model/users');
const logger = require('../../services/logger');

module.exports = function (req,res){
	let userId = req.auth.user._id;
    set_unread_msgs_emails_status(req.body,userId).then(function (err, about)
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

function set_unread_msgs_emails_status(data,userId){
    var deferred = Q.defer();
    ////console.log(data.user_id);
    var set =
        {
            is_unread_msgs_to_send: data.status,

        };
    users.update({ _id: userId},{ $set: set }, function (err, doc)
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