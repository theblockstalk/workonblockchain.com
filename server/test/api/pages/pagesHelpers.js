const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Users = require('../../../model/users');
const should = chai.should();

chai.use(chaiHttp);

chai.use(chaiHttp);


const getPageContent = module.exports.getPageContent = async function getPageContent(pageName,jwtToken) {
    const res = await chai.request(server)
        .get('/users/get_pages_content/' + pageName)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}