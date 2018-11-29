const chai = require('chai');
const chaiHttp = require('chai-http');
const sendgrid = require('../../../controller/services/email/sendGrid');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('sendgrid service', function () {

    describe('API v3', function() {

        it('it should add environment to regular email', async function() {
            let email = "jack@example.com";
            let newEmail = sendgrid.addEmailEnvironment(email);
            newEmail.should.equal("jack+wob_test_environment@example.com");
        })

        it('it should add environment to email with +', async function() {
            let email = "jack+test1@example.com";
            let newEmail = sendgrid.addEmailEnvironment(email);
            newEmail.should.equal("jack+test1_wob_test_environment@example.com");
        })

        it('it should remove environment to regular email', async function() {
            let email = "jack+wob_test_environment@example.com";
            let newEmail = sendgrid.removeEmailEnvironment(email);
            newEmail.should.equal("jack@example.com");
        })

        it('it should remove environment to email with +', async function() {
            let email = "jack+test1_wob_test_environment@example.com";
            let newEmail = sendgrid.removeEmailEnvironment(email);
            newEmail.should.equal("jack+test1@example.com");
        })
    })
});