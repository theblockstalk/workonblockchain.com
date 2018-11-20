const server = require('../../../../server');
const synchronizeSendGrid = require('../../../controller/services/cron/synchronizeSendGrid');
const mongooseUsers = require('../../../model/mongoose/users');
const User = require('../../../model/users');


describe('cron Sendgrid contacts', function () {
    this.timeout(100000);

    describe('synchronize database to sendgrid contacts', () => {

        it('it should process one candidate', async () => {
            await synchronizeSendGrid();
        })
    })
});