const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const chat = require('../../../model/chat');

const logger = require('../../services/logger');

module.exports = function (req,res){
    update_job_message(req.body).then(function (err, about)
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

function update_job_message(data){
    var deferred = Q.defer();
    ////console.log(data.id);
    var set =
        {
            is_job_offered: data.status,

        };
    chat.update({ _id: data.id},{ $set: set }, function (err, doc)
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