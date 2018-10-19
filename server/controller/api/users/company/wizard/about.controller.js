var Q = require('q');
var mongo = require('mongoskin');
const EmployerProfile = require('../../../../../model/employer_profile');
const logger = require('../../../../services/logger');

module.exports = function (req,res)
{
	let userId = req.auth.user._id;
    about_company(userId,req.body).then(function (err, data)
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

function about_company(_id, companyParam)
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

        var set =
            {
                company_founded:companyParam.company_founded,
                no_of_employees:companyParam.no_of_employees,
                company_funded: companyParam.company_funded,
                company_description:companyParam.company_description,

            };

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