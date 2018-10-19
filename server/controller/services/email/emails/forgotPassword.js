const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data, isAccountDisabed, hash,name) {
    const sendTo = {
        email:data.email
    };
    const subject = "Forgot password on Work on Blockchain";

    const resetPassswordUrl = settings.CLIENT.URL + 'reset_password?hash='+hash;
    const sendToArray = [sendTo];
    logger.debug('reset url: ' , resetPassswordUrl);
    let merge_tags;
    if(name !== null)
    {
    	merge_tags = [{
       	     "name": "FNAME",
             "content": name
         }, {
    	     "name": "RESET_PASSWORD_URL",
             "content": resetPassswordUrl
    	 }];
      
       
    }
    
    else
    {
    	merge_tags = [{
    	     "name": "RESET_PASSWORD_URL",
             "content": resetPassswordUrl
    	 }];
      
    }
   
    logger.debug('forgot passowrd feature: ' , merge_tags);
    const mandrillOptions = {
    	   templateName: "wob-forgot-password",
    	    message: {
    	    global_merge_vars: merge_tags ,
    	    subject: subject,
    	    to: sendToArray
    	  }
    };
    	
    logger.debug('mandril options: ' , mandrillOptions);

    emails.sendEmail(mandrillOptions, isAccountDisabed);
}