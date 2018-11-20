const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const candidateHelper = require('./candidate/candidateHelpers');
const userHelpers = require('./usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('cron Sendgrid contacts', function () {

    afterEach(async function () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('synchronize database to sendgrid contacts', () => {

        it('it should process one candidate', async () => {
            
        })
    })
});