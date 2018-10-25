process.env.NODE_ENV = 'migrate';

(async function run() {
    try {
        const upDown = process.argv[3];
        if ( !(upDown === 'up' || upDown === 'down') ) throw new Error("Second parameter must be 'up' or 'down', found " + upDown);

        const migrationFileName = process.argv[2];
        const migration = require('./' + migrationFileName);

        console.log('Running ' + upDown + 'migration ' + migrationFileName);

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
