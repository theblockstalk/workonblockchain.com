const settings = require('../../../settings');
var _ = require('lodash');
var Q = require('q');
const Pages = require('../../../model/pages_content');
const logger = require('../../services/logger');

module.exports = function (req,res)
{
    get_content(req.params.title).then(function (err, data)
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

function get_content(name)
{
    var deferred = Q.defer();
    if(name === 'Privacy Notice' || name === 'Terms and Condition for candidate' || name === 'Terms and Condition for company'){
        Pages.findOne({page_name: name}).sort({updated_date: 'descending'}).exec(function (err, result) {
            if (err) {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                ////console.log(user);
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }
    else {
        Pages.find({page_name: name}).exec(function (err, result) {

            if (err) {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                ////console.log(user);
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }
}