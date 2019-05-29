const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const fs = require('fs');

chai.use(chaiHttp);

const getRefCode = module.exports.getRefCode = async function getRefCode(email) {
    const res = await chai.request(server)
        .get('/v2/referral?email='+email)
        .send();
    res.should.have.status(200);
    return res;
}

const getRefDetail = module.exports.getRefDetail = async function getRefDetail(email,isAdmin, jwtToken) {
    const res = await chai.request(server)
        .get('/v2/referral?email='+email+'&admin='+isAdmin)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

const getRefreeInfo = module.exports.getRefreeInfo = async function getRefreeInfo(code) {
    const res = await chai.request(server)
        .get('/v2/referral?ref_code='+code)
        .send();
    res.should.have.status(200);
    return res;
}

const sendReferralEmail = module.exports.sendReferralEmail = async function sendReferralEmail(email,subject,body,jwtToken) {
    const data = {
        'email': email,
        'subject': subject,
        'body': body
    };
    const res = await chai.request(server)
        .post('/v2/referral/email')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}