const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const Users = require('../../../../model/users');
const userHelpers = require('../usersHelpers')
const should = chai.should();


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

const SummaryTnC = module.exports.SummaryTnC = async function SummaryTnC(companyTnCWizard,jwtToken){

    const res = await chai.request(server)
        .put('/users/company_wizard')
        .set('Authorization', jwtToken)
        .send(companyTnCWizard)
    res.should.have.status(200);
    return res;
}

const companyAboutWizard = module.exports.companyAboutWizard = async function companyAboutWizard(aboutData , jwtToken){

    const res = await chai.request(server)
        .put('/users/about_company')
        .set('Authorization', jwtToken)
        .send(aboutData)
    res.should.have.status(200);
    return res;
}

const companyProfileImg = module.exports.companyProfileImg = async function companyProfileImg(profileImage , jwtToken){

    const res = await chai.request(server)
        .post('/users/employer_image')
        .set('Authorization', jwtToken)
        .send(profileImage)
    res.should.have.status(200);
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

