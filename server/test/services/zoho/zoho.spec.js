const server = require('../../../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');

const settings = require('../../../settings');
const zoho = require('../../../controller/services/zoho/zoho');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

// if (settings.ENVIRONMENT === 'test-all') {
    describe('zoho tokens', function () {
        this.timeout(7000);

        afterEach(async function () {
            console.log('dropping database');
            await mongo.drop();
        })

        describe('using Zoho CRM API', function () {

            it('should get a new auth token and call the API', async function () {
                await zoho.initialize();
                await zoho.generateAuthTokenfromRefreshToken();

                const contacts = await zoho.contacts.getMany({
                    params: {
                        page: 0,
                        per_page: 1
                    }
                });

                assert(contacts.data.length === 1, "No contacts founds");
            })

            it('should get new auth token', async function () {
                await zoho.initialize();
                // await zoho.generateAuthTokens();
            })
        })
    });
// }