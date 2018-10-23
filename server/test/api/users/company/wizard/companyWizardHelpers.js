const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const Users = require('../../../../../model/users');
const should = chai.should();

chai.use(chaiHttp);

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