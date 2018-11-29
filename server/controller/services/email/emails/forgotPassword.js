const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(emailAddress,name,hash) {
    const sendTo = {
        email:emailAddress
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

    const sendGridOptions = {
        templateId: "d-84d5a0028f1141e68433cd97d14a876d",
        subject: subject,
        personalizations: [{
            to: {
                email: emailAddress,
                name: name
            }
        }],
        templateData: {
            firstName: name,
            resetPasswordUrl: resetPassswordUrl
        }
    };

    emails.sendEmail(sendGridOptions, false);
}