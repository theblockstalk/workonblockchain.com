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

