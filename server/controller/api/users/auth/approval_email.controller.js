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
	//console.log(email);
    var deferred = Q.defer();

    if(info.type === 'candidate')
    {
    	console.log("candidate");
    	candidateApprovedEmail.sendEmail(info.email, info.name);
    }
    
    if(info.type === 'company')
    {
    	console.log("comapny");
    	companyApprovedEmail.sendEmail(info.email, info.name);
    }
    
    return deferred.promise;
    
}