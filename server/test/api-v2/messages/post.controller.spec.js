const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
// const Chats = require('../../../model/chat');
const messagesHelpers = require('./helpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('send a message', function () {

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /v2/messages', () => {

        it('it should send a message', async () => {

            const res = await messagesHelpers.post({user_id: "heathea", msg_tag: 'job_offer'}, 'fake jwt token');
            res.status.should.equal(200);
         })
    })
});