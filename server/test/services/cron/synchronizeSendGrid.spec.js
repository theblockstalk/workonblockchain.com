const server = require('../../../../server');
const synchronizeSendGrid = require('../../../controller/services/cron/synchronizeSendGrid');
const settings = require('../../../settings');
settings.ENVIRONMENT = "staging"; // DELETE ME!

describe('cron Sendgrid contacts', function () {
    this.timeout(1000000000);

    describe('synchronize database to sendgrid contacts', () => {

        it('it should process one candidate', async () => {
            // await synchronizeSendGrid();
        })
    })
});