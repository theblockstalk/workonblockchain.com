const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const Users = require('../../../../../model/users');
const should = chai.should();

chai.use(chaiHttp);

const about = module.exports.about = async function about(data,jwtToken) {
    const detail = {
        'first_name' : data.first_name,
        'last_name' : data.last_name,
        'github_account' : data.github_account,
        'exchange_account' : data.stackexchange_account,
        'contact_number' : data.contact_number,
        'nationality' : data.nationality,
        'image_src' : data.image_src
    };
    const res = await chai.request(server)
        .put('/users/welcome/about')
        .set('Authorization', jwtToken)
        .send(detail);
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
    const detail = {
        'why_work' : data.why_work,
        'commercial_experience_year' : data.commercially_worked,
        'experimented_platform' : data.experimented_platform,
        'platforms' : data.platforms
    };
    const res = await chai.request(server)
        .put('/users/welcome/resume')
        .set('Authorization', jwtToken)
        .send(detail);
    return res;
}