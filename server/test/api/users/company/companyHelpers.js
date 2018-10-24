const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const Users = require('../../../../model/users');
const userHelpers = require('../usersHelpers');
const companyWizardHelpers = require('./wizard/companyWizardHelpers');
const should = chai.should();
const fs = require('fs');

chai.use(chaiHttp);

const signupCompany = module.exports.signupCompany = async function signupCompany(company) {
    const res = await chai.request(server)
        .post('/users/create_employer')
        .send(company);
    res.should.have.status(200);
    return res;
}

module.exports.signupVerfiedCompany = async function signupVerfiedCompany(company) {
    await signupCompany(company);
    await userHelpers.verifyEmail(company.email);
}

module.exports.signupAdminCompany = async function signupAdminCompany(company) {
    await signupCompany(company);
    await userHelpers.makeAdmin(company.email);
}

module.exports.signupVerifiedApprovedCompany = async function signupVerifiedApprovedCompany(company) {
    await signupCompany(company);
    await userHelpers.verifyEmail(company.email);
    await userHelpers.approve(company.email);
}
module.exports.signupCompanyAndCompleteProfile = async function signupCompanyAndCompleteProfile(company, companyTnCWizard , aboutData) {
    const res = await signupCompany(company);
    await userHelpers.verifyEmail(company.email);
    await userHelpers.approve(company.email);
    await companyWizardHelpers.SummaryTnC(companyTnCWizard, res.body.jwt_token);
    await companyWizardHelpers.companyAboutWizard(aboutData, res.body.jwt_token);
}

const getCompanies = module.exports.getCompanies = async function getCompanies(jwtToken){
    const res = await chai.request(server)
        .get('/users/company')
        .set('Authorization', jwtToken)
    res.should.have.status(200);
    return res;
}

const getCurrentCompany = module.exports.getCurrentCompany = async function getCurrentCompany(companyId,jwtToken){
    const res = await chai.request(server)
        .get('/users/current_company/' + companyId)
        .set('Authorization', jwtToken)
    res.should.have.status(200);
    return res;
}



module.exports.image = async function image(file, jwtToken) {

    const company_logo = fs.readFileSync(file.path);
    const res = await chai.request(server)
        .post('/users/employer_image')
        .set('Authorization', jwtToken)
        .attach('photo', company_logo, file.name);
    res.status.should.equal(200);
    return res;

}

const UpdateCompanyProfile = module.exports.UpdateCompanyProfile = async function UpdateCompanyProfile(profileData,jwtToken){

    const res = await chai.request(server)
        .put('/users/update_company_profile')
        .set('Authorization', jwtToken)
        .send(profileData)
    res.should.have.status(200);
    return res;

}

const companyFilter = module.exports.companyFilter = async function companyFilter(filterData,jwtToken){

    const res = await chai.request(server)
        .post('/users/filter')
        .set('Authorization', jwtToken)
        .send(filterData)
    res.should.have.status(200);
    return res;
}

const verifiedCandidate = module.exports.verifiedCandidate = async function verifiedCandidate(jwtToken){

    const res = await chai.request(server)
        .post('/users/verified_candidate')
        .set('Authorization', jwtToken)
    res.should.have.status(200);
    return res;
}

const getVerifiedCandidateDetail = module.exports.getVerifiedCandidateDetail = async function getVerifiedCandidateDetail(userId,companyReply,jwtToken){
    const data = {
        '_id' : userId,
        'company_reply' : companyReply
    }
    const res = await chai.request(server)
        .post('/users/candidate_detail')
        .set('Authorization', jwtToken)
        .send(data)
    res.should.have.status(200);
    return res;
}

