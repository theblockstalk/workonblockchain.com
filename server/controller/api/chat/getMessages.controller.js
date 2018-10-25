const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const chat = require('../../../model/chat');

const logger = require('../../services/logger');

module.exports = function (req, res)
{
    get_messages(req.body.receiver_id,req.body.sender_id).then(function (data)
    {
        if (data)
        {
            res.send(data);
        }
        else
        {
            res.sendStatus(404);
        }
    })
        .catch(function (err)
        {
            res.status(400).send(err);
        });
}

function get_messages(receiver_id,sender_id){
    ////console.log(receiver_id)
    var deferred = Q.defer();
    /*$or : [
        { $and : [ { receiver_id : {$regex: receiver_id} }, { sender_id : {$regex: sender_id} } ] },
        { $and : [ { receiver_id : {$regex: sender_id} } }, { sender_id : {$regex: receiver_id} } ] }
    ]*/
    chat.find({
        $or : [
            { $and : [ { receiver_id : receiver_id }, { sender_id : sender_id } ] },
            { $and : [ { receiver_id : sender_id }, { sender_id : receiver_id } ] }
        ]
    }).sort({_id: 'ascending'}).exec(function(err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            ////console.log(data);
            deferred.resolve({
                datas:data
            });
        }
    });
    return deferred.promise;
}