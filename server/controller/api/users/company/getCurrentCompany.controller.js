const settings = require('../../../../settings');
var Q = require('q');
const EmployerProfile = require('../../../../model/employer_profile');
const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');

//////////get sign-up data from db of specific company////////////

module.exports = function (req, res)
{
	//let userId = req.auth.user._id;
    get_company_byId(req.params._id).then(function (user)
    {
        if (user)
        {
            res.send(user);
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

function get_company_byId(_id)
{
    //console.log(_id);
    var deferred = Q.defer();
    EmployerProfile.findById(_id).populate('_creator').exec(function(err, result)
    {
        if (err)
        {
            logger.error(err.message, {stack: err.stack});
            //console.log("Not found");
            deferred.resolve({error:"Not found"});
        }// deferred.reject(err.name + ': ' + err.message);
        if(!result)
        {
            EmployerProfile.find({_creator : _id}).populate('_creator').exec(function(err, result)
            {
                if (err)
                {
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                {
                	var query_result = result[0].toObject();      
                    deferred.resolve(filterReturnData.removeSensativeData(query_result));
                }
            });
        }
        else
        {
        	var query_result = result.toObject();      
            deferred.resolve(filterReturnData.removeSensativeData(query_result));
        }
           


    });


    return deferred.promise;
}