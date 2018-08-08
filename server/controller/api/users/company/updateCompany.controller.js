const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const EmployerProfile = require('../../../../model/employer_profile');
const logger = require('../../../services/logger');

module.exports = function (req,res)
{
    update_company_profile(req.params._id,req.body).then(function (err, data)
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

function update_company_profile(_id , companyParam)
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
                first_name : companyParam.first_name,
                last_name: companyParam.last_name,
                job_title:companyParam.job_title,
                company_name: companyParam.company_name,
                company_website:companyParam.company_website,
                company_phone:companyParam.phone_number,
                company_country:companyParam.country,
                company_city:companyParam.city,
                company_postcode:companyParam.postal_code,
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