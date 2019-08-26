const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../helpers/mongo');


const server = require('../../../server');
const users = require('../../model/mongoose/users');
const zoho = require('../../controller/services/zoho');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('zoho', function () {
    this.timeout(7000);

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('using Zoho CRM API', function () {

        it('should get a new refresh token', async function () {
            await zoho.initialize();
            // await zoho.generateAuthTokens();
            await zoho.generateAuthTokenfromRefreshToken();

            await zoho.contacts.get();
        })
    })
});