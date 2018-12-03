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

        it('it should send an email', async () => {
            const lastEmailSent = addDays(new Date(), -4)
            const sendNotification = await companyWizardHelper.sendNewNotification(lastEmailSent , 3);
            sendNotification.should.equal(true);
        })

        it('it should not send an email', async () => {
            const lastEmailSent = addDays(new Date(), -2)
            const sendNotification = await companyWizardHelper.sendNewNotification(lastEmailSent , 3);
            sendNotification.should.equal(false);
        })


    })
});

function addDays(theDate, days) {
    return new Date(theDate.getTime() + days*24*60*60*1000);
}