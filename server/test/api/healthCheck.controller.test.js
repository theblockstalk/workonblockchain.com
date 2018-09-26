const chai = require('chai');
const server = require('../../server');
const chaiHttp = require('chai-http');

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

            // let adminUser = testUtils.generateRandomUser();

            // let createCompanyRequest = testUtils.generateRandomCompany();
            //
            // let tokenObj = {};
            // let randomBoolean = testUtils.generateRandomBoolean();
            //
            // let createdUser = await
            // authenticationWrapper.signupVerifyAuthenticateWithRole(adminUser, tokenObj, 'admin');
            //
            // createCompanyRequest.admin = createdUser.username;
            // createCompanyRequest.visible_to_public = randomBoolean;
            let res = await chai.request(server)
                .post('/companies')
                .set('Authorization', 'Bearer ' + tokenObj.token)
                .send(createCompanyRequest);

            res.should.have.status(200);

            // await resolverLoop.processTransactions();
            //
            // await testUtils.wait(config.get('test.bcTransactionTime'));
            //
            // let companyFromMongo = await
            // mongooseCompanyRepo.findOneByPrettyId(createCompanyRequest.pretty_id);
        })
    })
});