const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const chat = require('../../../model/chat');
const logger = require('../../services/logger');

module.exports = function (req, res)
{
    get_employment_offer(req.body.sender_id,req.body.receiver_id,req.body.msg_tag).then(function (data)
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

function get_employment_offer(sender_id,receiver_id,message_tag){
    var deferred = Q.defer();
    chat.findOne({
        $and : [
			{
				is_job_offered: 1
			},
            {
				sender_id: sender_id
            },
			{
				receiver_id:receiver_id
			},
            {
                msg_tag:message_tag
            }
        ]
    }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            if(data){
				deferred.resolve({
					datas:data._id
				});
			}
			else{
				deferred.resolve({
					datas:0
				});
			}
        }
    });
    return deferred.promise;
}