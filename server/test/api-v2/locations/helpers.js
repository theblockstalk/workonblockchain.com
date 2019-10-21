const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');

const cities = require('../../../model/mongoose/cities');
const enumerations = require('../../../model/enumerations');
const random = require('../../helpers/random');

const should = chai.should();
chai.use(chaiHttp);

const getLocations = module.exports.getLocations = async function getLocations(autosuggest,country,jwtToken) {
    //let input = {'autosuggest' :autosuggest , 'countries' : country };
    const res = await chai.request(server)
        .get('/v2/locations?autosuggest=' + autosuggest + '&countries=' + country.countries)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

module.exports.insertCity = async function() {
    return await cities.insert({
        city: random.string(),
        country: random.string(),
        active: true
    })
}