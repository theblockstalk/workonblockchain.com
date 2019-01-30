process.env.NODE_ENV = 'migrate';

const mongoose = require('mongoose');
const settings = require('../settings');

(async function run() {
    try {
        const upDown = process.argv[3];
        if ( !(upDown === 'up' || upDown === 'down') ) throw new Error("Second parameter must be 'up' or 'down', found " + upDown);

        const migrationFileName = process.argv[2];
        const migration = require('./' + migrationFileName);

        await connectToMongo();

        console.log('Running migration ' + upDown + ' file: ' + migrationFileName);

        if (upDown === 'up') {
            await migration.up();
        } else {
            await migration.down();
        }

        console.log("Finished");
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
    process.exit(0);
})();

async function connectToMongo() {
    console.log('Mongodb connection string: ' + settings.MONGO_CONNECTION_STRING);

    mongoose.connect(settings.MONGO_CONNECTION_STRING);

    return new Promise((res, rej) => {
        mongoose.connection.on('connected', () => {
            console.log('Connected to mongodb database');
            res();
        });

        mongoose.connection.on('error', (error) => {
            rej(error)
        });
    })
}