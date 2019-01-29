const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../usersHelpers')
const candidateWizardHelpers = require('./wizard/candidateWizardHelpers')

const should = chai.should();
const fs = require('fs');

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
    await userHelpers.approveCandidate(candidate.email);
}

module.exports.signupCandidateAndCompleteProfile = async function signupCandidateAndCompleteProfile(candidate, about, job,resume,experience) {
    const res = await signupCandidate(candidate);
    await userHelpers.verifyEmail(candidate.email);
    await candidateWizardHelpers.about(about, res.body.jwt_token);
    await candidateWizardHelpers.job(job, res.body.jwt_token);
    await candidateWizardHelpers.resume(resume, res.body.jwt_token);
    await candidateWizardHelpers.experience(experience, res.body.jwt_token);
    await userHelpers.approveCandidate(candidate.email);
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

const candidateTerms = module.exports.candidateTerms = async function candidateTerms(termsID,data,jwtToken) {
    const detail = {
        'termsID' : termsID,
        'marketing' : data.marketing
    };
    const res = await chai.request(server)
        .put('/users/welcome/terms')
        .set('Authorization', jwtToken)
        .send(detail);
    return res;
}

const editProfile = module.exports.editProfile = async function editProfile(updatedData,jwtToken) {

    const res = await chai.request(server)
        .put('/users/update_profile')
        .set('Authorization', jwtToken)
        .send(updatedData);
    return res;
}

module.exports.image = async function image(file, jwtToken) {

    const image = fs.readFileSync(file.path);
    const res = await chai.request(server)
        .post('/users/image')
        .set('Authorization', jwtToken)
        .attach('photo', image, file.name);
    res.status.should.equal(200);
    return res;

}

const autoSuggestOptions = module.exports.autoSuggestOptions = async function autoSuggestOptions(queryInput, jwtToken) {
    const res = await chai.request(server)
        .post('/users/auto_suggest/'+ {} )
        .set('Authorization', jwtToken)
        .send(queryInput);
    res.should.have.status(200);
    return res;
}
