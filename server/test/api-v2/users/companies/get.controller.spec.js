const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const docGenerator = require('../../../helpers/docGenerator');

const api = require('../../api');
const companyHelper = require('./helpers');
const jobHelper = require('../../jobs/helpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get current company detail', function () {

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /v2/users/companies', function () {

        it('it should get current company profile detail', async function () {
            const company = docGenerator.company();
            await companyHelper.signupCompany(company);

            const userDoc = await Users.findOne({email: company.email});

            const res = await api.users.companies.GET(userDoc.jwt_token, {
                user_id: userDoc._id
            });
            res.status.should.equal(200);

            const companyRes = res.body;
            companyRes._creator.email.should.equal(company.email);
            companyRes.first_name.should.equal(company.first_name);
            companyRes.last_name.should.equal(company.last_name);
        })

        it('it should get current company profile detail including jobs', async function () {
            const company = docGenerator.company();
            await companyHelper.signupCompany(company);

            const userDoc = await Users.findOne({email: company.email});

            const jobPost = await jobHelper.jobPost();
            await api.jobs.POST(userDoc.jwt_token, null, jobPost)

            const res = await api.users.companies.GET(userDoc.jwt_token, {
                user_id: userDoc._id
            });

            const companyRes = res.body;
            companyRes._creator.email.should.equal(company.email);
            const job = companyRes.job_ids[0];
            job.name.should.equal(jobPost.name);
        })
    })
});