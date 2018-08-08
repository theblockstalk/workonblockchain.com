var Q = require('q');
var mongo = require('mongoskin');
const EmployerProfile = require('../../../../../model/employer_profile');
const logger = require('../../../../services/logger');

///////////add company summary or Terms& conditions in db////////////////////////////

module.exports = function (req,res)
{

    company_summary(req.params._id,req.body).then(function (err, data)
    {
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });

}

function company_summary(_id, companyParam)
{

    var deferred = Q.defer();
    var _id = _id;

    EmployerProfile.findOne({ _creator: _id }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            updateEmployer(_id);

    });

    function updateEmployer(_id)
    {
        if(companyParam.terms)
        {
            var set =
                {
                    terms:companyParam.terms,
                    marketing_emails: companyParam.marketing,

                };
        }
        else
        {
            var set =
                {
                    disable_account:companyParam.disable_account,
                    marketing_emails: companyParam.marketing,

                };
        }

        EmployerProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc)
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