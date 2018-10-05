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

const forgotPasswordEmail = module.exports.forgotPassworsEmail = async function(email){
    const res = await chai.request(server)
        .put('/users/forgot_password/' + email);
    res.should.have.status(200);
    return res;
}

const changeUserPassword = module.exports.changeUserPassword = async function(inputData,jwtToken){
    const data = {
        'current_password' : inputData.current_password,
        'password' : inputData.password
    }
    const res = await chai.request(server)
        .put('/users/change_password')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const resetPassword = module.exports.resetPassword = async function(forgot_password_key , password){
    const data = {
        'password' : password
    }
    const res = await chai.request(server)
        .put('/users/reset_password/' + forgot_password_key)
        .send(data);
    res.should.have.status(200);
    return res;
}

const verifyClient = module.exports.verifyClient = async function (email){
    const res = await chai.request(server)
        .put('/users/verify_client/'+ email);
    res.should.have.status(200);
    return res;
}

