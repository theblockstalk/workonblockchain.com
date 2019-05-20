const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');

const should = chai.should();
chai.use(chaiHttp);

const addPages = module.exports.addPages = async function addPages(cmsData,jwtToken) {
    const res = await chai.request(server)
        .post('/v2/pages')
        .set('Authorization', jwtToken)
        .send(cmsData);
    res.should.have.status(200);
    return res;
}