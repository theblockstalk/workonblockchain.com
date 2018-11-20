const synchronizeSendGrid = require('../../../controller/services/cron/synchronizeSendGrid');
const mongooseUsers = require('../../../model/mongoose/users');
const User = require('../../../model/users');
const settings = require('../../../settings');
console.log(settings);

describe('cron Sendgrid contacts', function () {
    this.timeout(100000);

    afterEach(async function() {
        console.log('dropping database');
        // await mongo.drop();
    })

    describe('synchronize database to sendgrid contacts', () => {

        it('it should process one candidate', async () => {
            // let userDoc = await mongooseUsers.findOneByEmail("sarakhan10024@gmail.com");
            // console.log(userDoc);
            userDoc = await User.findOne({email: "sarakhan10024@gmail.com"});
            console.log(userDoc);
            // await synchronizeSendGrid();
        })
    })
});