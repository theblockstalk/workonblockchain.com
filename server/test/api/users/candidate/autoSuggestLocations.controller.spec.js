const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const candidateHelper = require('./candidateHelpers');

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
        const autoSuggestOptions = await candidateHelper.autoSuggestOptions("rem");
        console.log(autoSuggestOptions.body)
        })
    })

});