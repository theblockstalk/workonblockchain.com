const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const Users = require('../../../../../model/users');
const should = chai.should();

chai.use(chaiHttp);

const experience = module.exports.experience = async function experience(data,jwtToken) {

    const res = await chai.request(server)
        .put('/users/welcome/exp')
        .set('Authorization', jwtToken)
        .send(data);
    return res;
}

const job = module.exports.job = async function job(data,jwtToken) {

    const res = await chai.request(server)
        .put('/users/welcome/job')
        .set('Authorization', jwtToken)
        .send(data);
    return res;
}

const resume = module.exports.resume = async function resume(data,jwtToken) {

    const res = await chai.request(server)
        .put('/users/welcome/resume')
        .set('Authorization', jwtToken)
        .send(data);
    return res;
}

const prefilledProfile = module.exports.prefilledProfile = async function prefilledProfile(data,jwtToken) {

    const res = await chai.request(server)
        .put('/users/welcome/prefilled_profile')
        .set('Authorization', jwtToken)
        .send(data);
    return res;
}