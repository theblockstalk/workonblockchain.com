const rootpath = require('rootpath');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const settings = require('./settings');
const logger = require('./controller/services/logger');
const sanitizer = require('./controller/middleware/sanitizer');
const errorHandler = require('./controller/middleware/errorHandler');
const routes = require('./routes');
const cron = require('./cron');

let app = express();

module.exports = app;

try {
    logger.debug('settings', settings);

    rootpath();

    app.use(cors());

    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(sanitizer.middleware);

    app.use(routes);

    app.use(errorHandler);

    cron.startCron();

    mongoose.connect(settings.MONGO_CONNECTION_STRING);

    mongoose.connection.on('connected',() => {
        logger.info('Connected to mongodb database');
    });

    mongoose.connection.on('error', (error) => {
        if (error) {
            logger.error(error.message, {stack: error.stack});
            process.exit(1);
        }
    });

    const port = settings.SERVER.PORT;

    app.listen(port, function () {
        logger.info('Server listening on port ' + port);
    });
} catch(error) {
    logger.error(error.message, {stack: error.stack});
}