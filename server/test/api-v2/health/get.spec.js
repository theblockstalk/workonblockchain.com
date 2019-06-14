const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const mongo = require('../../helpers/mongo');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('healthCheck', function () {

    afterEach(async () => {
        console.log('dropping database');
        //await mongo.drop();
    })

    describe('GET /v2/healthCheck', () => {

        it('it should get a successful page', async () => {

            let res = await chai.request(server)
                .get('/v2/health')
                .send();

            res.should.have.status(200);

            // Three ways of running tests using chai
            res.body.success.should.equal(true);
            expect(res.body.version).to.equal("localhost");
            assert(res.body.message === "this is a health check for the API");
        })

        it('it should throw an Application error', async function () {
        let res = await chai.request(server)
            .get('/v2/health?error=true')
            .send();

        res.should.have.status(400);

        // Three ways of running tests using chai
        res.body.success.should.equal(false);
        res.body.message.should.equal("I am an application error");
        })


        it('it should throw a normal error', async function()  {

            let res = await chai.request(server)
                .get('/v2/health?error=true&raw=true')
                .send();

            res.should.have.status(500);

            // Three ways of running tests using chai
            res.body.success.should.equal(false);
            res.body.message.should.equal("I am a normal error");
        })
    })
});