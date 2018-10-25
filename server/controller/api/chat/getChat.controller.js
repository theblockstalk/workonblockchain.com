const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const chat = require('../../../model/chat');

const logger = require('../../services/logger');

module.exports = function (req,res)
{
    get_chat().then(function (data)
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

function get_chat()
{
    var deferred = Q.defer();
    chat.find().exec(function(err, result)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            deferred.resolve(result);

    });

    return deferred.promise;
}