const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('healthCheck', function () {
    // beforeEach(async () => {
    //     console.log('connecting to database');
    //     // await DB.connect();
    // })
    //
    // afterEach(async () => {
    //     console.log('dropping database');
    //     // await DB.drop();
    // })

    describe('GET /', () => {

        it('it should get a successful page', async () => {

            let res = await chai.request(server)
                .get('/')
                .send();

            res.should.have.status(200);
        })
    })
});