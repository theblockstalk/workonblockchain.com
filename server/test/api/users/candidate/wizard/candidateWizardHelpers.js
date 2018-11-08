const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const Users = require('../../../../../model/users');
const should = chai.should();

chai.use(chaiHttp);

const about = module.exports.about = async function about(data,jwtToken) {
    const res = await chai.request(server)
        .put('/users/welcome/about')
        .set('Authorization', jwtToken)
        .send(data);
    return res;
}

const experience = module.exports.experience = async function experience(data,jwtToken) {
    const detail = {
        'language_exp' : data.language_exp,
        'education' : data.education,
        'work' : data.work,
        'detail' : data.detail
    };
    const res = await chai.request(server)
        .put('/users/welcome/exp')
        .set('Authorization', jwtToken)
        .send(detail);
    return res;
}

const job = module.exports.job = async function job(data,jwtToken) {
    const detail = {
        'country' : data.country,
        'roles' : data.roles,
        'interest_area' : data.interest_area,
        'base_currency' : data.base_currency,
        'expected_salary' : data.expected_salary,
        'availability_day' : data.availability_day,
        'current_salary' : data.current_salary,
        'current_currency' : data.current_currency
    };
    const res = await chai.request(server)
        .put('/users/welcome/job')
        .set('Authorization', jwtToken)
        .send(detail);
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