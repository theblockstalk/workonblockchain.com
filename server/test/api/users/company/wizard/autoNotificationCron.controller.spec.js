const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const companyWizardHelper = require('./companyWizardHelpers');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('check auto notication cron service', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('check last_email_sent', () => {

        it('it should check last_email_sent', async () => {
            const company = docGenerator.company();
            const companyRes = await companyHelper.signupCompany(company);

            const companyPrefernces = docGenerator.companySavedSearches();
            await companyWizardHelper.companySavedSearchesWizard(companyPrefernces , companyRes.body.jwt_token);

            const userDoc = await Users.findOne({email: company.email}).lean();
            const companyDoc = await Companies.findOne({_creator: userDoc._id}).lean();
            const cronRes = await companyWizardHelper.sendNewNotification(new Date('2018/11/2') , 3);
            cronRes.should.equal(true);
        })
    })
});