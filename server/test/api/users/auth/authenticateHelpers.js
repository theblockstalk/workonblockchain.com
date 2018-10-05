const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../usersHelpers')
const should = chai.should();

chai.use(chaiHttp);

const authenticateUser = module.exports.authenticateUser = async function authenticateUser(email, password) {
    const authenticatedData = {
        'email': email,
        'password': password
    };
    const res = await chai.request(server)
        .post('/users/authenticate')
        .send(authenticatedData);
    res.should.have.status(200);
    return res;
}

const verifyEmail = module.exports.verifyEmail = async function verifyEmail(verify_email_key) {

    const res = await chai.request(server)
        .put('/users/emailVerify/' + verify_email_key);
    res.should.have.status(200);
    return res;
}

