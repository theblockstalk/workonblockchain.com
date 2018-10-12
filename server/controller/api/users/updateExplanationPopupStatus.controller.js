var Q = require('q');
const users = require('../../../model/users');

module.exports = function (req,res){
    updatePopupStatus(req.body).then(function (err, about)
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

function updatePopupStatus(data){
    var deferred = Q.defer();
    var set =
    {
        viewed_explanation_popup: data.status,

    };
    users.update({ _id: data.userId},{ $set: set }, function (err, doc)
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