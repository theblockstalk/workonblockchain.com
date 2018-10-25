const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');

const chat = require('../../../model/chat');

const logger = require('../../services/logger');

module.exports = function (req, res)
{
	//console.log("idddddddddddd");
	//console.log(req.body.id);
    get_user_messages(req.body.id).then(function (data)
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

function get_user_messages(id){
    var deferred = Q.defer();
    chat.find({
        $or:[{receiver_id:id},{sender_id: id}]
    },{_id:0,sender_id:1,receiver_id:1,is_company_reply:1}).sort({_id: 'descending'}).exec(function(err, data)
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