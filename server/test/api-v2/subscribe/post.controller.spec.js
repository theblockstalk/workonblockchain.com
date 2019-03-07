const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const subHelpers = require('../subscribe/subscribe-helpers');
const docGenerator = require('../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('POST /subscribe', function () {

    afterEach(async function () {
        console.log('dropping database');
        this.timeout(1000);
        await mongo.drop();
    })

    describe('testing endpoint', function () {

        it('it should should test endpoint', async function () {
            const subscribe = docGenerator.subscribe();

            let res = await subHelpers.post(subscribe);
            res.status.should.equal(200);
        })
    });
});