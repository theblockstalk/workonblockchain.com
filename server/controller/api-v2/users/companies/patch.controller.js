const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');

const companies = require('../../../../model/mongoose/company');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id/companies'
};
const paramSchema = new Schema({
    user_id: String
});

const bodySchema = new Schema({
    terms_id: {
        type: Schema.Types.ObjectId,
        ref: 'pages_content'
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
    company_founded: {
        type:Number,
        min: 1800
    },
    no_of_employees: {
        type:Number,
        min: 1
    },
    company_funded: {
        type:String
    },
    company_logo: {
        type: String,
        validate: regexes.url
    },
    company_description: {
        type: String,
        maxlength: 3000
    },

    saved_searches: {
        type:[new Schema({
            search_name: String,
            location: {
                type: [{
                    city: {
                        type : Schema.Types.ObjectId,
                        ref: 'Cities'
                    },
                    remote: Boolean,

                }]
            },
            visa_needed: {
                type: Boolean,
                default:false,
            },
            job_type: {
                type: [{
                    type: String,
                    required : true,
                    enum: enumerations.jobTypes
                }]

            },
            position: {
                type: [{
                    type: String,
                    required : true,
                    enum: enumerations.workRoles
                }]
            },
            current_currency: {
                type: String,
                required : true,
                enum: enumerations.currencies
            },
            current_salary: {
                type:Number,
                required : true,
                min: 0
            },
            blockchain: {
                type: [{
                    type: String,
                    enum: enumerations.blockchainPlatforms
                }]
            },
            skills: {
                type: [{
                    type: String,
                    enum: enumerations.programmingLanguages
                }]
            },
            residence_country: {
                type: String,
                enum: enumerations.countries

            },
            other_technologies : {
                type : String
            },

            order_preferences : {
                type: [{
                    type: String,
                    enum: enumerations.blockchainPlatforms
                }]
            }

        })]
    },
    when_receive_email_notitfications : {
        type : String ,
        enum : enumerations.email_notificaiton
    },
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "company_logo");
}

module.exports.auth = async function (req) {
    await auth.isValidCompany(req);
}


module.exports.endpoint = async function (req, res) {
    console.log("company endpoint");
    let userId = req.auth.user._id;
    const employerDoc = await companies.findOne({ _creator: userId });

    if(employerDoc){
        const queryBody = req.body;
        let employerUpdate = {};
        if(req.file && req.file.path) employerUpdate.company_logo = req.file.path;

        if (queryBody.first_name) employerUpdate.first_name = queryBody.first_name;
        if (queryBody.last_name) employerUpdate.last_name = queryBody.last_name;
        if (queryBody.job_title) employerUpdate.job_title = queryBody.job_title;
        if (queryBody.company_name) employerUpdate.company_name = queryBody.company_name;
        if (queryBody.company_website) employerUpdate.company_website = queryBody.company_website;
        if (queryBody.phone_number) employerUpdate.company_phone = queryBody.phone_number;
        if (queryBody.country) employerUpdate.company_country = queryBody.country;
        if (queryBody.city) employerUpdate.company_city = queryBody.city;
        if (queryBody.postal_code) employerUpdate.company_postcode = queryBody.postal_code;
        if (queryBody.company_founded) employerUpdate.company_founded = queryBody.company_founded;
        if (queryBody.no_of_employees) employerUpdate.no_of_employees = queryBody.no_of_employees;
        if (queryBody.company_funded) employerUpdate.company_funded = queryBody.company_funded;
        if (queryBody.company_description) employerUpdate.company_description = queryBody.company_description;
        if (queryBody.saved_searches) employerUpdate.saved_searches = queryBody.saved_searches;
        if (queryBody.when_receive_email_notitfications) employerUpdate.when_receive_email_notitfications = queryBody.when_receive_email_notitfications;

        await companies.update({ _creator: userId },{ $set: employerUpdate });

        res.send(true);
    }

    else {
        errors.throwError("Company account not found", 404);
    }
}