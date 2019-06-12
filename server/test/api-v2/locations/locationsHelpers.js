const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');

const should = chai.should();
chai.use(chaiHttp);

const getLocations = module.exports.getLocations = async function getLocations(autosuggest,country,jwtToken) {
    //let input = {'autosuggest' :autosuggest , 'countries' : country };
    const res = await chai.request(server)
        .get('/v2/locations?autosuggest=' + autosuggest + '&country=' + country)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}