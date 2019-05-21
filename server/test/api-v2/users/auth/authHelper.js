const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../../../api/users/usersHelpers');

const should = chai.should();
chai.use(chaiHttp);

const authenticateUser = module.exports.authenticateUser = async function authenticateUser(inputParams) {

    const res = await chai.request(server)
        .post('/v2/users/auth')
        .send(inputParams);
    res.should.have.status(200);
    return res;
}

const destroyToken = module.exports.destroyToken  = async function destroyToken(jwtToken){
    const res = await chai.request(server)
        .delete('/v2/users/auth/')
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

const changeUserPassword = module.exports.changeUserPassword = async function(inputData,jwtToken){
    const res = await chai.request(server)
        .put('/v2/users/auth/password?current_password='+inputData.current_password+'&new_password='+inputData.password)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

const forgotPasswordEmail = module.exports.forgotPassworsEmail = async function forgotPassworsEmail(email){
    const input = {
        email:email
    };
    const res = await chai.request(server)
        .post('/v2/users/auth/password/reset')
        .send(input);
    res.should.have.status(200);
    return res;
}

const resetPassword = module.exports.resetPassword = async function(forgot_password_key , password){
    const res = await chai.request(server)
        .put('/v2/users/auth/password/reset?forgot_password_token=' + forgot_password_key+'&new_password='+password)
        .send();
    res.should.have.status(200);
    return res;
}