const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const Users = require('../../../../../model/users');
const should = chai.should();

chai.use(chaiHttp);

const SummaryTnC = module.exports.SummaryTnC = async function SummaryTnC(termsID,companyTnCWizard,jwtToken){
    const detail = {
        'termsID' : termsID,
        'marketing' : companyTnCWizard.marketing
    };
    const res = await chai.request(server)
        .put('/users/company_wizard')
        .set('Authorization', jwtToken)
        .send(detail)
    res.should.have.status(200);
    return res;
}


const sendNewNotification = module.exports.sendNewNotification = async function sendNewNotification(last_email_sent , when_receive_notification) {
    const now = new Date();
    console.log(last_email_sent, now, when_receive_notification);
    if(last_email_sent  <  new Date(now - (when_receive_notification * 24*60*60*1000))) {
        return true;
    }
    else {
        return false;
    }
}