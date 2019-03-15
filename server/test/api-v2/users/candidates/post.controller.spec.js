const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator-v2');
const candidateHelper = require('./candidateHelpers');
const userHelper = require('../../../api/users/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('update candidate profile', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('post /users/candidates', () => {

        it('it should create candidate profile', async () => {


    })
})
});