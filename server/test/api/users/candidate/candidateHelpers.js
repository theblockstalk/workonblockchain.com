const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../usersHelpers')
const should = chai.should();

chai.use(chaiHttp);


const signupCandidate = module.exports.signupCandidate = async function signupCandidate(candidate) {
    const res = await chai.request(server)
        .post('/users/register')
        .send(candidate);
    res.should.have.status(200);
    return res;
}

const signupAdminCandidate = module.exports.signupAdminCandidate = async function signupAdminCandidate(candidate) {
    await signupCandidate(candidate);
    await userHelpers.makeAdmin(candidate.email);
}

module.exports.signupVerfiedCandidate = async function signupVerfiedCandidate(candidate) {
    await signupCandidate(candidate);
    await userHelpers.verifyEmail(candidate.email);
}

module.exports.signupVerifiedApprovedCandidate = async function signupVerifiedApprovedCandidate(candidate) {
    await signupCandidate(candidate);
    await userHelpers.verifyEmail(candidate.email);
    await userHelpers.approve(candidate.email);
    await userHelpers.makeAdmin(candidate.email);
}

const getAll = module.exports.getAll = async function getAll(jwtToken) {
    const res = await chai.request(server)
        .get('/users/')
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

const getCurrentCandidateInfo = module.exports.getCurrentCandidateInfo = async function getCurrentCandidateInfo(id,jwtToken) {
    const res = await chai.request(server)
        .get('/users/current/'+id)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

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