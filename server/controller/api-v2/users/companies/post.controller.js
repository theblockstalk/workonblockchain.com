const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');
const objects = require('../../../services/objects');

const companies = require('../../../../model/mongoose/company');
const Users = require('../../../../model/mongoose/users');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id/companies'
};
const paramSchema = new Schema({
    user_id: String
});

const querySchema = new Schema({
    admin: Boolean
});

const bodySchema = new Schema({
    email: {
        type:String,
        validate: regexes.email,
        lowercase: true,
    },
    password: {
        type:String,
        validate: regexes.password
    },
    first_name: {
        type:String
    },
    last_name: {
        type:String
    },
    job_title: {
        type:String
    },
    company_name: {
        type:String
    },
    company_website: {
        type:String,
        validate: regexes.url
    },
    company_phone: {
        type:String
    },
    company_country: {
        type: String,
        enum: enumerations.countries
    },
    company_city: {
        type:String
    },
    company_postcode: {
        type:String
    },

});

module.exports.inputValidation = {
    body: bodySchema
};



module.exports.endpoint = async function (req, res) {
    const queryBody = req.body;
    const companyDoc = await Users.findOneByEmail(queryBody.email);
    if(companyDoc){
        errors.throwError('Email "' + queryBody.email + '" is already taken', 400)
    }
    else{

    }
}