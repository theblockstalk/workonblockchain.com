const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const Users = require('../../../../../model/users');
const should = chai.should();

chai.use(chaiHttp);

const prefilledProfile = module.exports.prefilledProfile = async function prefilledProfile(data,jwtToken) {

    const res = await chai.request(server)
        .put('/users/welcome/prefilled_profile')
        .set('Authorization', jwtToken)
        .send(data);
    return res;
}