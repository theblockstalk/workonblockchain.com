const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const Pages = require('../../../../model/pages_content');
const logger = require('../../../services/logger');

//////////delete sign-up data from db of specific candidate////////////

module.exports = function (req, res)
    {
        _delete(req.params._id).then(function ()
        {
            res.json('success');
        })
            .catch(function (err)
            {
                res.status(400).send(err);
            });
    }

function _delete(_id) {
    var deferred = Q.defer();
    CandidateProfile.remove({ _creator: mongo.helper.toObjectID(_id) },function (err)
    {
        if (err)
        {	logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }

        users.remove({ _id: mongo.helper.toObjectID(_id) }, function (err)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                deferred.resolve();
        });
    });

    Pages.remove({ _id : mongo.helper.toObjectID('5b489267e2f74420b8b7f612') },function (err)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            deferred.resolve();

    });

    /*EmployerProfile.remove({ _creator: mongo.helper.toObjectID(_id) },function (err)
            {
        if (err)
            deferred.reject(err.name + ': ' + err.message);

            users.remove({ _id: mongo.helper.toObjectID(_id) }, function (err)
            {
                if (err)
                    deferred.reject(err.name + ': ' + err.message);
                else
                    deferred.resolve();
            });
    });

    */

    return deferred.promise;
}