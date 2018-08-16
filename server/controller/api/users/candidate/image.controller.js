const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');

///// for save candidate "image(sign-up)"  in db///////////////////

module.exports = function (req, res) {
    logger.debug('req.file', {file: req.file});
    let path;
    if (settings.isLiveApplication()) {
        path = req.file.location;
    } else {
        let pathUrl = settings.CLIENT.URL
        path = pathUrl + req.file.location
    }
    if (settings.isLiveApplication()) {
        path = req.file.location; // for S3 bucket
    } else {
        path = settings.FILE_URL + req.file.filename;
    }
    save_image(path, req.params._id).then(function (err, about) {
        console.log('userService.save_image')
        if (about) {
            res.json(about);
        }
        else {
            res.json(err);
        }
    })
        .catch(function (err) {
            res.json({error: err});
        });

}

function save_image(filename,_id)
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data)
    {
        if (err)
        {
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
                image:filename
            };

        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc)
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