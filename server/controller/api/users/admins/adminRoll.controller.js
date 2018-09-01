var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const logger = require('../../../services/logger');

module.exports = function (req,res)
{
    admin_role(req.body).then(function (data)
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

function admin_role(data)
{
    var deferred = Q.defer();
    console.log(data);
    users.findOne({ email: data.email }, function (err, result)
    {
        //console.log(result);
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(result)
            updateAdminRole(result._id);

        else
            deferred.reject('Email Not Found');


    });

    function updateAdminRole(_id)
    {
        //console.log(_id);
        var set =
            {
                is_admin: 1,

            };
        users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                deferred.resolve(set);
        });
    }
    return deferred.promise;

}
