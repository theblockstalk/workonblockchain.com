const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const Users = require('../../../../model/users');
const userHelpers = require('../usersHelpers')
const should = chai.should();

chai.use(chaiHttp);

const getRefreeInfo = module.exports.getRefreeInfo = async function getRefreeInfo(code) {
    const data = {
        'code': code
    };
    const res = await chai.request(server)
        .post('/users/get_refrence_code')
        .send(data);
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
        .post('/users/send_refreal')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const sendEmail = module.exports.sendEmail = async function sendEmail(data) {

    const res = await chai.request(server)
        .post('/users/refered_user_email')
        .send(data);
    res.should.have.status(200);
    return res;
}

const getRefCode = module.exports.getRefCode = async function getRefCode(email) {
    const data = {
        'email': email
    };
    const res = await chai.request(server)
        .post('/users/get_ref_code')
        .send(data);
    res.should.have.status(200);
    return res;
}

const getRefDetail = module.exports.getRefDetail = async function getRefDetail(data, jwtToken) {

    const res = await chai.request(server)
        .post('/users/get_refrence_detail')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}