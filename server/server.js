require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');
const settings = require('./services/settings');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
/*app.use(expressJwt({
    secret: settings.EXPRESS_JWT_SECRET,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register'] }));*/
 
// routes
app.use('/users', require('./controller/users.controller'));

mongoose.connect(settings.MONGO_CONNECTION_STRING);

// //on connection
mongoose.connection.on('connected',()=>
{
    console.log('Connected to mongodb database');
});

mongoose.connection.on('error',(err)=>
{
    if(err)
    {
        console.log('Error in database connection'+ err);
        process.exit(1);
    }
});

// start server
var port = settings.ENVIRONMENT === 'production' ? 80 : 4000;
var server = app.listen(port, function () 
{
    console.log('Server listening on port ' + port);
});