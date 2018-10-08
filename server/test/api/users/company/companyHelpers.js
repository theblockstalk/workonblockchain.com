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
    const data = {
        'terms' :   companyTnCWizard.terms,
        'marketing' : companyTnCWizard.marketing_emails
    }
    const res = await chai.request(server)
        .put('/users/company_wizard')
        .set('Authorization', jwtToken)
        .send(data)
    res.should.have.status(200);
    return res;
}

const companyAboutWizard = module.exports.companyAboutWizard = async function companyAboutWizard(aboutData , jwtToken){
    const data = {
        'company_founded' :   aboutData.company_founded,
        'no_of_employees' : aboutData.no_of_employees,
        'company_funded' : aboutData.company_funded,
        'company_description' : aboutData.company_description
    }
    const res = await chai.request(server)
        .put('/users/about_company')
        .set('Authorization', jwtToken)
        .send(data)
    res.should.have.status(200);
    return res;
}

const companyProfileImg = module.exports.companyProfileImg = async function companyProfileImg(profileImage , jwtToken){
    const data = {
        'filename' : profileImage
    }
    const res = await chai.request(server)
        .post('/users/employer_image')
        .set('Authorization', jwtToken)
        .send(data)
    res.should.have.status(200);
    return res;
}

const UpdateCompanyProfile = module.exports.UpdateCompanyProfile = async function UpdateCompanyProfile(profileData,jwtToken){
    const data = {
        'first_name': profileData.first_name,
        'last_name': profileData.last_name,
        'job_title': profileData.job_title,
        'company_name': profileData.company_name,
        'company_website': profileData.company_website,
        'phone_number': profileData.phone_number,
        'country': profileData.country,
        'postal_code': profileData.postal_code,
        'city': profileData.city,
        'company_founded':profileData.company_founded,
        'no_of_employees':profileData.no_of_employees,
        'company_funded':profileData.company_funded,
        'company_description':profileData.company_description
    }
    const res = await chai.request(server)
        .put('/users/update_company_profile')
        .set('Authorization', jwtToken)
        .send(data)
    res.should.have.status(200);
    return res;

}
