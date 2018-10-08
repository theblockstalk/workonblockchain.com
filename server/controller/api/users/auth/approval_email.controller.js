const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');
const companyApprovedEmail = require('../../../services/email/emails/companyApproved');
const logger = require('../../../services/logger');


module.exports = function (req, res) {
    approval_email(req.body).then(function (user)
    {
        if (user)
        {
            // authentication successful
            res.json(user);
        }
        else
        {
            // authentication failed
            res.json({msg: 'Username or password is incorrect'});
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function approval_email(info)
{
    var deferred = Q.defer();

    if(info.type === 'candidate')
    {
    	candidateApprovedEmail.sendEmail(info.email, info.name);
        deferred.resolve({success:true});
    }
    
    else if(info.type === 'company')
    {
    	companyApprovedEmail.sendEmail(info.email, info.name);
        deferred.resolve({success:true});
    }

    else
    {
        deferred.resolve({success:false});
    }
    
    return deferred.promise;
    
}