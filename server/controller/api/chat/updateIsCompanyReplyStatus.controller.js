const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const chat = require('../../../model/chat');
const mongoose = require('mongoose');

const logger = require('../../services/logger');

module.exports = function (req,res){
    update_is_company_reply(req.body).then(function (err, about)
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

function update_is_company_reply(data){
    var deferred = Q.defer();
    var set =
        {
            is_company_reply: data.status,

        };
    chat.update({ receiver_id: mongoose.Types.ObjectId(data.id)},{ $set: set },{multi: true}, function (err, doc)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            deferred.resolve(set);
		}
    });
    return deferred.promise;
}