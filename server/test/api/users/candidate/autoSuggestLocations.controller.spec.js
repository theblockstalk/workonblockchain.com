const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const candidateHelper = require('./candidateHelpers');
const docGenerator = require('../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('Auto suggest cities options', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('Post /users/auto_suggest/:query_input' ,() => {
        it('it should send match options', async () =>{
        const candidate = docGenerator.candidate();
        const candidateRes = await candidateHelper.signupCandidate(candidate);
console.log(candidateRes.body)
        const autoSuggestOptions = await candidateHelper.autoSuggestOptions({'autosuggest' : "rem", countries:true} , candidateRes.body.jwt_token );
        console.log(autoSuggestOptions.body)
        })
    })

});