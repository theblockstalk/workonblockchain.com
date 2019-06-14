const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const users = require('../../../model/mongoose/users');
const locationsHelpers = require('./locationsHelpers');
const docGenerator = require('../../helpers/docGenerator-v2');
const candidateHelper = require('../otherHelpers/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('Auto suggest cities options', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('getting locations' ,() => {
        it('it should get match options', async () =>{
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidatDoc = await users.findOneByEmail(candidate.email);
            const autosuggest= 'rem';
            const options = {countries: true};
            const autoSuggestOptions = await locationsHelpers.getLocations(autosuggest, options , candidatDoc.jwt_token );
            console.log(autoSuggestOptions.body)
        })
    })

});