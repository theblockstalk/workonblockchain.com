const settings = require('../../../../settings');
var Q = require('q');
const EmployerProfile = require('../../../../model/employer_profile');
const logger = require('../../../services/logger');

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
    EmployerProfile.findById(_id).populate('_creator' ,'created_date , email , is_admin , is_approved , is_unread_msgs_to_send , is_verify ,  jwt_token , type , refered_id , ref_link , disable_account'	).exec(function(err, result)
    {
        if (err)
        {
            logger.error(err.message, {stack: err.stack});
            //console.log("Not found");
            deferred.resolve({error:"Not found"});
        }// deferred.reject(err.name + ': ' + err.message);
        if(!result)
        {
            EmployerProfile.find({_creator : _id}).populate('_creator', 'created_date , email , is_admin , is_approved , is_unread_msgs_to_send , is_verify ,  jwt_token , type , refered_id , ref_link , disable_account'	).exec(function(err, result)
            {
                if (err)
                {
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                    deferred.resolve(result);
            });
        }
        else
            deferred.resolve(result);


    });


    return deferred.promise;
}