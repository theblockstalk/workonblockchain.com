const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const EmployerProfile = require('../../../../model/employer_profile');
const logger = require('../../../services/logger');


module.exports = function (req, res)
{

    
    res.json(req.file.filename);
    let path;
    if (settings.isLiveApplication()) {
        path = req.file.location; // for S3 bucket
    } else {
        path = settings.FILE_URL+req.file.filename;
    }
    let userId = req.auth.user._id;
    save_employer_image(path , userId).then(function (err, about)

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

function save_employer_image(filename,_id)
{
    var deferred = Q.defer();
    EmployerProfile.findOne({ _creator: _id }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            updateImage(_id);
    });

    function updateImage(_id)
    {
        var set =
            {
                company_logo:filename
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