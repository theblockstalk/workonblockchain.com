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