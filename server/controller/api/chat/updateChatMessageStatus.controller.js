const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const chat = require('../../../model/chat');

const logger = require('../../services/logger');

module.exports = function (req,res){
	let userId = req.auth.user._id;
    update_chat_msg_status(req.body,userId).then(function (err, about)
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

function update_chat_msg_status(data,sender_id){
    var deferred = Q.defer();
    var set =
        {
            is_read: 1,

        };
    chat.update({
        $and : [
            {
                /*$or : [
                    { $and : [ { receiver_id : {$regex: data.receiver_id} }, { sender_id : {$regex: data.sender_id} } ] },
                    { $and : [ { receiver_id : {$regex: data.sender_id} }, { sender_id : {$regex: data.receiver_id} } ] }
                ]*/
                receiver_id: sender_id
            },
            {
                sender_id: data.receiver_id
            },
            {
                is_read:data.status
            }
        ]
    } ,{ $set: set },{multi: true}, function (err, doc)
    {
        if (err){
			console.log(err);
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            deferred.resolve(set);
    });
    return deferred.promise;
}
