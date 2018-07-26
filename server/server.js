require('rootpath')();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const settings = require('./settings');
const sanitizer = require('./controller/middleware/sanitizer');
const errorHandler = require('./controller/middleware/errorHandler');
const routes = require('./routes');

let app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(sanitizer.middleware);

app.use(routes);
app.use('/users', require('./controller/users.controller'));

app.use(errorHandler.handleError);

mongoose.connect(settings.MONGO_CONNECTION_STRING);

mongoose.connection.on('connected',() =>
{
    console.log('Connected to mongodb database');
});

mongoose.connection.on('error', (err) =>
{
    if (err)
    {
        console.log('Error in database connection'+ err);
        process.exit(1);
    }
});

const port = settings.SERVER.PORT;

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});