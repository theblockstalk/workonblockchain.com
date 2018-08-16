const settings = require('../../../../settings');
var Q = require('q');
const EmployerProfile = require('../../../../model/employer_profile');
const logger = require('../../../services/logger');

//////////get sign-up data from db of all companies////////////

module.exports = function (req, res)
{
    getCompany().then(function (users)
    {
        res.send(users);
    })
        .catch(function (err)
        {
            res.status(400).send(err);
        });
}

function getCompany()
{
    var deferred = Q.defer();

    EmployerProfile.find().populate('_creator').exec(function(err, result)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            deferred.resolve(result);
        //console.log(result);
    });

    return deferred.promise;
}