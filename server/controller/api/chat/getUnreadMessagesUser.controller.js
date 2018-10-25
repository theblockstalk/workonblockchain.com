const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const chat = require('../../../model/chat');
const logger = require('../../services/logger');

module.exports = function (req,res){
    get_unread_msgs_of_user(req.body).then(function (err, about)
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

function get_unread_msgs_of_user(data){
    var deferred = Q.defer();
    chat.count({ $and : [
            {
                $and:[{receiver_id:data.receiver_id},{sender_id: data.sender_id}]
            },
            {
                is_read:0
            }
        ] }, function (err, result){
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            ////console.log(result);
            deferred.resolve({
                receiver_id: data.receiver_id,
                sender_id: data.sender_id,
                number_of_unread_msgs:result
            });
        }
    });
    return deferred.promise;
}